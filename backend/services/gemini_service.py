import google.generativeai as genai
from config import Config

class GeminiService:
    def __init__(self):
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
        self.vision_model = genai.GenerativeModel('gemini-pro-vision')
    
    def generate_story(self, issues_data, format_type="narrative", tone="engaging"):
        """Generate narrative story from Jira data"""
        
        # Format issues into readable text
        issues_text = "\n".join([
            f"- {issue['key']}: {issue['summary']} (Status: {issue['status']}, Assigned to: {issue['assignee']})\n"
            f"  Comments: {' | '.join(issue['comments'][:2]) if issue['comments'] else 'No comments'}"
            for issue in issues_data
        ])
        
        if format_type == "narrative":
            prompt = f"""You are a creative technical storyteller. Based on these Jira tickets, write an engaging narrative story (2-3 paragraphs) about the team's project journey. Make it feel like a movie or novel, highlighting key challenges, breakthroughs, and team dynamics.

Issues:
{issues_text}

Tone: {tone}

Write the story now:"""
        
        elif format_type == "milestone":
            prompt = f"""Based on these Jira tickets, create a milestone-focused summary. Highlight key achievements, blockers overcome, and important moments in 3-4 bullet points. Be concise and impactful.

Issues:
{issues_text}

Write the summary now:"""
        
        else:  # chaos_to_resolution
            prompt = f"""Tell the story of how the team went from chaos/confusion to a working solution. Base it on these Jira tickets. Make it dramatic and inspiring (2-3 paragraphs).

Issues:
{issues_text}

Tone: {tone}

Write the story now:"""
        
        response = self.model.generate_content(prompt)
        return response.text
    
    def generate_comic_prompts(self, issues_data, num_panels=4):
        """Generate prompts for comic strip panels"""
        
        issues_summary = "\n".join([
            f"- {issue['key']}: {issue['summary']}"
            for issue in issues_data[:5]
        ])
        
        prompt = f"""Based on these Jira issues, create {num_panels} comic strip panel descriptions for a technical team's project journey. Each panel should be a vivid, specific description suitable for image generation.

Issues:
{issues_summary}

Format your response as exactly {num_panels} numbered panels, each with a detailed visual description. Example:
1. A developer looking confused at code on screen with red error messages everywhere, office environment, cartoon style
2. Team members gathered around discussing with thought bubbles containing light bulbs
[etc...]

Generate the {num_panels} panels now:"""
        
        response = self.model.generate_content(prompt)
        return response.text
    
    def generate_comic_images(self, comic_prompts):
        """Generate comic strip images"""
        # Note: Gemini's image generation is limited in preview
        # For now, we'll create detailed prompts that could be used with DALL-E or Midjourney
        
        panels = comic_prompts.split('\n')
        image_prompts = []
        
        for panel in panels:
            if panel.strip():
                refined_prompt = f"Comic strip panel in cartoon style, vibrant colors: {panel}"
                image_prompts.append(refined_prompt)
        
        return image_prompts