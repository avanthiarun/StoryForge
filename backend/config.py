import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
    STATSIG_SECRET_KEY = os.getenv("STATSIG_SECRET_KEY")
    ATLASSIAN_API_TOKEN = os.getenv("ATLASSIAN_API_TOKEN")
    ATLASSIAN_CLOUD_ID = os.getenv("ATLASSIAN_CLOUD_ID")
    ATLASSIAN_CLIENT_ID = os.getenv("ATLASSIAN_CLIENT_ID")
    ATLASSIAN_CLIENT_SECRET = os.getenv("ATLASSIAN_CLIENT_SECRET")
    
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///storyforge.db")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    FRONTEND_URL = os.getenv("FRONTEND_URL")
    BACKEND_URL = os.getenv("BACKEND_URL")