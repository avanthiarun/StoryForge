import requests
from config import Config

class ElevenLabsService:
    def __init__(self):
        self.api_key = Config.ELEVENLABS_API_KEY
        self.base_url = "https://api.elevenlabs.io/v1"
    
    def get_voices(self):
        """Get available voices"""
        try:
            response = requests.get(
                f"{self.base_url}/voices",
                headers={"xi-api-key": self.api_key}
            )
            return response.json()['voices']
        except Exception as e:
            print(f"Error getting voices: {e}")
            return []
    
    def generate_narration(self, text, voice_id="21m00Tcm4TlvDq8ikWAM", tone="narrative"):
        """Generate audio narration using ElevenLabs"""
        try:
            response = requests.post(
                f"{self.base_url}/text-to-speech/{voice_id}",
                headers={"xi-api-key": self.api_key},
                json={
                    "text": text,
                    "model_id": "eleven_monolingual_v1",
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.75
                    }
                }
            )
            
            if response.status_code == 200:
                # In production, save to cloud storage (S3, GCS, etc.)
                # For now, return the audio content
                return {
                    "status": "success",
                    "audio": response.content,
                    "content_type": "audio/mpeg"
                }
            else:
                return {"status": "error", "message": response.text}
        
        except Exception as e:
            print(f"Error generating narration: {e}")
            return {"status": "error", "message": str(e)}