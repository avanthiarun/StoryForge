from statsig import statsig
from config import Config

class StatsigService:
    def __init__(self):
        if Config.STATSIG_SECRET_KEY:
            statsig.initialize(secret_key=Config.STATSIG_SECRET_KEY)
    
    def log_story_engagement(self, user_id, story_id, variant, action):
        """Log user engagement with stories"""
        try:
            statsig.log_event(
                user_id=user_id,
                event_name="story_engagement",
                value=1,
                metadata={
                    "story_id": story_id,
                    "variant": variant,
                    "action": action  # "view", "share", "download", etc.
                }
            )
        except Exception as e:
            print(f"Error logging to Statsig: {e}")
    
    def get_variant(self, user_id, gate_name="story_format"):
        """Get which variant user should see"""
        try:
            return statsig.get_feature_gate(user_id, gate_name)
        except Exception as e:
            print(f"Error getting variant: {e}")
            return None