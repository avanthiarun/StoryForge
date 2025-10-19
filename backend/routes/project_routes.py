from flask import Blueprint, request, jsonify
from models.database import db, Project, User
from services.jira_service import JiraService
from auth.jwt_handler import verify_token

project_bp = Blueprint('projects', __name__, url_prefix='/projects')

def get_current_user():
    """Extract user from JWT token"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    payload = verify_token(token)
    if payload:
        return User.query.get(payload.get('user_id'))
    return None


@project_bp.route('/', methods=['GET'])
def get_projects():
    """Get all projects for current user"""
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    
    projects = Project.query.filter_by(user_id=user.id).all()
    return jsonify([{
        "id": p.id,
        "name": p.project_name,
        "key": p.jira_project_key,
        "description": p.description,
        "created_at": p.created_at.isoformat()
    } for p in projects])


@project_bp.route('/sync', methods=['POST'])
def sync_projects():
    """Sync Jira projects"""
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        jira = JiraService(user.atlassian_access_token, user.cloud_id)
        jira_projects = jira.get_projects()
        
        for jp in jira_projects:
            existing = Project.query.filter_by(
                user_id=user.id,
                jira_project_key=jp['key']
            ).first()
            
            if not existing:
                project = Project(
                    user_id=user.id,
                    jira_project_id=jp['id'],
                    jira_project_key=jp['key'],
                    project_name=jp['name'],
                    description=jp.get('description', '')
                )
                db.session.add(project)
        
        db.session.commit()
        
        return jsonify({"success": True, "message": f"Synced {len(jira_projects)} projects"})
    
    except Exception as e:
        print(f"Error syncing projects: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500