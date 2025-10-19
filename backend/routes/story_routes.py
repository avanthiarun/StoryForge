from flask import Blueprint, request, jsonify
from models.database import db, Story, Project, User
from services.jira_service import JiraService
from services.gemini_service import GeminiService
from services.elevenlabs_service import ElevenLabsService
from services.image_service import ImageService
from auth.jwt_handler import verify_token
import uuid

story_bp = Blueprint('stories', __name__, url_prefix='/stories')

def get_current_user():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    payload = verify_token(token)
    if payload:
        return User.query.get(payload.get('user_id'))
    return None


@story_bp.route('/generate', methods=['POST'])
def generate_story():
    """Generate a new story"""
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    project_id = data.get('project_id')
    time_range = data.get('time_range', 'last_sprint')
    tone = data.get('tone', 'engaging')
    format_type = data.get('format', 'narrative')
    include_comics = data.get('include_comics', True)
    num_panels = data.get('num_panels', 4)
    
    print(f"=== STORY GENERATION START ===")
    print(f"Project ID: {project_id}")
    print(f"Time range: {time_range}")
    print(f"Tone: {tone}")
    print(f"Format: {format_type}")
    print(f"Include comics: {include_comics}")
    print(f"Num panels: {num_panels}")
    
    try:
        project = Project.query.filter_by(id=project_id, user_id=user.id).first()
        if not project:
            print("ERROR: Project not found")
            return jsonify({"error": "Project not found"}), 404
        
        print(f"Found project: {project.project_name} (key: {project.jira_project_key})")
        
        # Fetch Jira data
        print("Fetching Jira issues...")
        jira = JiraService(user.atlassian_access_token, user.cloud_id)
        issues = jira.get_issues(project.jira_project_key, time_range)
        formatted_issues = jira.format_issues_for_story(issues)
        
        print(f"Formatted {len(formatted_issues)} issues for story generation")
        
        if not formatted_issues:
            print("ERROR: No issues found in this project")
            return jsonify({"error": "No issues found in this project"}), 400
        
        # Generate story
        print("Generating story with Gemini...")
        gemini = GeminiService()
        narrative_text = gemini.generate_story(formatted_issues, format_type, tone)
        
        if not narrative_text:
            print("ERROR: Failed to generate story text")
            return jsonify({"error": "Failed to generate story text"}), 500
        
        print(f"Generated story text: {len(narrative_text)} characters")
        
        # Generate comic (optional)
        comic_panels = []
        if include_comics:
            print("Generating comic prompts...")
            comic_prompts = gemini.generate_comic_prompts(formatted_issues, num_panels)
            print(f"Generated {len(comic_prompts)} comic prompts")
            
            image_service = ImageService()
            comic_panels = image_service.generate_placeholder_panels(comic_prompts, num_panels)
            print(f"Generated {len(comic_panels)} comic panels")
        
        # Generate narration
        print("Generating audio narration...")
        elevenlabs = ElevenLabsService()
        audio_response = elevenlabs.generate_narration(narrative_text, tone=tone)
        
        audio_url = None
        if audio_response.get('status') == 'success':
            audio_url = f"/api/stories/{uuid.uuid4()}/audio"
            print("Audio generation successful")
        else:
            print(f"Audio generation failed: {audio_response}")
        
        # Save story to database
        print("Saving story to database...")
        story = Story(
            user_id=user.id,
            project_id=project.id,
            narrative_text=narrative_text,
            comic_panels=comic_panels,
            audio_url=audio_url,
            time_range=time_range,
            tone=tone,
            format=format_type,
            num_panels=num_panels,
            engagement_score=0
        )
        db.session.add(story)
        db.session.commit()
        
        print(f"Story saved with ID: {story.id}")
        print("=== STORY GENERATION SUCCESS ===")
        
        return jsonify({
            "success": True,
            "story": {
                "id": story.id,
                "narrative_text": story.narrative_text,
                "comic_panels": story.comic_panels,
                "audio_url": story.audio_url,
                "tone": story.tone,
                "format": story.format,
                "num_panels": story.num_panels,
                "created_at": story.created_at.isoformat()
            }
        }), 201
    
    except Exception as e:
        print(f"ERROR generating story: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@story_bp.route('/<story_id>', methods=['GET'])
def get_story(story_id):
    """Get a specific story"""
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    
    story = Story.query.filter_by(id=story_id, user_id=user.id).first()
    if not story:
        return jsonify({"error": "Story not found"}), 404
    
    return jsonify({
        "id": story.id,
        "project_id": story.project_id,
        "narrative_text": story.narrative_text,
        "comic_panels": story.comic_panels,
        "audio_url": story.audio_url,
        "tone": story.tone,
        "format": story.format,
        "num_panels": story.num_panels,
        "engagement_score": story.engagement_score,
        "created_at": story.created_at.isoformat()
    })


@story_bp.route('/', methods=['GET'])
def get_all_stories():
    """Get all stories for user"""
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    
    stories = Story.query.filter_by(user_id=user.id).order_by(Story.created_at.desc()).all()
    
    return jsonify([{
        "id": s.id,
        "project_id": s.project_id,
        "tone": s.tone,
        "format": s.format,
        "created_at": s.created_at.isoformat()
    } for s in stories])


@story_bp.route('/<story_id>', methods=['DELETE'])
def delete_story(story_id):
    """Delete a story"""
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    
    story = Story.query.filter_by(id=story_id, user_id=user.id).first()
    if not story:
        return jsonify({"error": "Story not found"}), 404
    
    db.session.delete(story)
    db.session.commit()
    
    return jsonify({"success": True, "message": "Story deleted"})