import requests
from flask import current_app
from config import Config

class JiraService:
    def __init__(self, access_token, cloud_id):
        self.access_token = access_token
        self.cloud_id = cloud_id
        self.base_url = f"https://api.atlassian.com/ex/jira/{cloud_id}"
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
    
    def get_projects(self):
        """Fetch all Jira projects"""
        try:
            response = requests.get(
                f"{self.base_url}/rest/api/3/projects",
                headers=self.headers
            )
            return response.json()
        except Exception as e:
            print(f"Error fetching projects: {e}")
            return []
    
    def get_issues(self, project_key, time_range="last_sprint"):
        """Fetch issues from a project"""
        try:
            # Build JQL query based on time range
            if time_range == "last_sprint":
                jql = f'project = {project_key} AND sprint in (openSprints(), closedSprints()) ORDER BY updated DESC'
            elif time_range == "last_month":
                jql = f'project = {project_key} AND updated >= -30d ORDER BY updated DESC'
            else:
                jql = f'project = {project_key} ORDER BY updated DESC'
            
            response = requests.get(
                f"{self.base_url}/rest/api/3/search",
                headers=self.headers,
                params={
                    "jql": jql,
                    "expand": "changelog",
                    "maxResults": 50
                }
            )
            return response.json()
        except Exception as e:
            print(f"Error fetching issues: {e}")
            return {"issues": []}
    
    def format_issues_for_story(self, issues):
        """Format Jira issues into narrative-friendly data"""
        formatted = []
        
        for issue in issues.get('issues', []):
            formatted.append({
                "key": issue['key'],
                "summary": issue['fields']['summary'],
                "description": issue['fields'].get('description', ''),
                "status": issue['fields']['status']['name'],
                "created": issue['fields']['created'],
                "updated": issue['fields']['updated'],
                "assignee": issue['fields']['assignee']['displayName'] if issue['fields'].get('assignee') else "Unassigned",
                "comments": [c['body']['content'][0]['text'] for c in issue['fields'].get('comment', {}).get('comments', [])],
                "issuetype": issue['fields']['issuetype']['name']
            })
        
        return formatted