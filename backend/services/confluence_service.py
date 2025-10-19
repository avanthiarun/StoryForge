import requests
from config import Config

class ConfluenceService:
    def __init__(self, access_token, cloud_id):
        self.access_token = access_token
        self.cloud_id = cloud_id
        self.base_url = f"https://api.atlassian.com/ex/confluence/{cloud_id}"
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
    
    def create_page(self, space_key, title, content, parent_id=None):
        """Create a new Confluence page"""
        try:
            data = {
                "title": title,
                "space": {"key": space_key},
                "body": {
                    "storage": {
                        "value": content,
                        "representation": "storage"
                    }
                },
                "type": "page"
            }
            
            if parent_id:
                data["ancestors"] = [{"id": parent_id}]
            
            response = requests.post(
                f"{self.base_url}/rest/api/content",
                headers=self.headers,
                json=data
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error creating page: {response.text}")
                return None
                
        except Exception as e:
            print(f"Error creating Confluence page: {e}")
            return None
    
    def update_page(self, page_id, title, content, version):
        """Update an existing Confluence page"""
        try:
            data = {
                "id": page_id,
                "title": title,
                "type": "page",
                "version": {"number": version + 1},
                "body": {
                    "storage": {
                        "value": content,
                        "representation": "storage"
                    }
                }
            }
            
            response = requests.put(
                f"{self.base_url}/rest/api/content/{page_id}",
                headers=self.headers,
                json=data
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error updating page: {response.text}")
                return None
                
        except Exception as e:
            print(f"Error updating Confluence page: {e}")
            return None
    
    def get_page(self, page_id):
        """Get a Confluence page by ID"""
        try:
            response = requests.get(
                f"{self.base_url}/rest/api/content/{page_id}",
                headers=self.headers,
                params={"expand": "body.storage,version"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error getting page: {response.text}")
                return None
                
        except Exception as e:
            print(f"Error getting Confluence page: {e}")
            return None
    
    def search_pages(self, query, space_key=None, limit=10):
        """Search for pages in Confluence"""
        try:
            params = {
                "cql": f"text ~ \"{query}\"",
                "limit": limit
            }
            
            if space_key:
                params["cql"] = f"space = {space_key} AND text ~ \"{query}\""
            
            response = requests.get(
                f"{self.base_url}/rest/api/content/search",
                headers=self.headers,
                params=params
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error searching pages: {response.text}")
                return None
                
        except Exception as e:
            print(f"Error searching Confluence pages: {e}")
            return None
    
    def get_spaces(self):
        """Get all accessible spaces"""
        try:
            response = requests.get(
                f"{self.base_url}/rest/api/space",
                headers=self.headers,
                params={"limit": 100}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error getting spaces: {response.text}")
                return None
                
        except Exception as e:
            print(f"Error getting Confluence spaces: {e}")
            return None
    
    def format_story_for_confluence(self, story_data):
        """Format story data for Confluence page creation"""
        content = f"""
        <h2>Project Story</h2>
        <p><strong>Tone:</strong> {story_data.get('tone', 'N/A')}</p>
        <p><strong>Format:</strong> {story_data.get('format', 'N/A')}</p>
        <p><strong>Created:</strong> {story_data.get('created_at', 'N/A')}</p>
        
        <h3>Narrative</h3>
        <p>{story_data.get('narrative_text', 'No narrative available')}</p>
        """
        
        if story_data.get('comic_panels'):
            content += "<h3>Comic Strip</h3>"
            for panel in story_data['comic_panels']:
                content += f"""
                <h4>Panel {panel.get('panel_number', '')}</h4>
                <p><em>{panel.get('prompt', '')}</em></p>
                <img src="{panel.get('url', '')}" alt="Comic Panel {panel.get('panel_number', '')}" />
                """
        
        if story_data.get('audio_url'):
            content += f"""
            <h3>Audio Narration</h3>
            <p><a href="{story_data['audio_url']}">Listen to Story</a></p>
            """
        
        return content
