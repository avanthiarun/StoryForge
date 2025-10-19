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
            print(f"Fetching projects from: {self.base_url}/rest/api/3/project")
            print(f"Using cloud_id: {self.cloud_id}")
            print(f"Using access_token: {self.access_token[:20]}...")
            
            # Use the correct endpoint that we know works
            response = requests.get(
                f"{self.base_url}/rest/api/3/project",
                headers=self.headers
            )
            
            print(f"Response status: {response.status_code}")
            print(f"Response headers: {dict(response.headers)}")
            
            if response.status_code != 200:
                print(f"Error response: {response.text}")
                return []
            
            projects = response.json()
            print(f"Found {len(projects)} projects")
            for project in projects:
                print(f"  - {project.get('key', 'N/A')}: {project.get('name', 'N/A')}")
            return projects
            
        except Exception as e:
            print(f"Error fetching projects: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def get_issues(self, project_key, time_range="last_sprint"):
        """Fetch issues from a project"""
        try:
            print(f"Fetching issues for project: {project_key}")
            print(f"Using cloud_id: {self.cloud_id}")
            print(f"Using access_token: {self.access_token[:20]}...")
            
            # Try multiple JQL queries to find issues
            queries_to_try = [
                f'project = {project_key} ORDER BY updated DESC',  # Simplest query
                f'project = "{project_key}" ORDER BY updated DESC',  # With quotes
                f'project = {project_key} AND updated >= -90d ORDER BY updated DESC',  # Last 90 days
                f'project = {project_key} AND status != "Done" ORDER BY updated DESC',  # Exclude done
                f'project = {project_key} AND issuetype != "Sub-task" ORDER BY updated DESC',  # Exclude sub-tasks
            ]
            
            for i, jql in enumerate(queries_to_try):
                print(f"\nTrying query {i+1}: {jql}")
                
                response = requests.get(
                    f"{self.base_url}/rest/api/3/search",
                    headers=self.headers,
                    params={
                        "jql": jql,
                        "expand": "changelog",
                        "maxResults": 50
                    }
                )
                
                print(f"Response status: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    issues = data.get("issues", [])
                    print(f"Found {len(issues)} issues with query {i+1}")
                    
                    if issues:
                        # Print all issue titles
                        for j, issue in enumerate(issues):
                            summary = issue.get("fields", {}).get("summary", "No title")
                            key = issue.get("key", "No key")
                            status = issue.get("fields", {}).get("status", {}).get("name", "No status")
                            print(f"  {j+1}. {key}: {summary} [{status}]")
                        
                        return data
                    else:
                        print(f"No issues found with query {i+1}, trying next...")
                else:
                    print(f"Query {i+1} failed: {response.text[:200]}...")
            
            # If all queries failed, try a basic project search
            print(f"\nAll queries failed, trying basic project search...")
            response = requests.get(
                f"{self.base_url}/rest/api/3/search",
                headers=self.headers,
                params={
                    "jql": f'project = {project_key}',
                    "maxResults": 10
                }
            )
            
            print(f"Basic search status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                issues = data.get("issues", [])
                print(f"Basic search found {len(issues)} issues")
                
                if issues:
                    for j, issue in enumerate(issues):
                        summary = issue.get("fields", {}).get("summary", "No title")
                        key = issue.get("key", "No key")
                        status = issue.get("fields", {}).get("status", {}).get("name", "No status")
                        print(f"  {j+1}. {key}: {summary} [{status}]")
                    
                    return data
            
            print(f"No issues found in any query for project {project_key}")
            return {"issues": []}
            
        except Exception as e:
            print(f"Error fetching issues: {e}")
            import traceback
            traceback.print_exc()
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