from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    atlassian_user_id = db.Column(db.String(255), unique=True)
    atlassian_access_token = db.Column(db.Text)
    cloud_id = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    projects = db.relationship('Project', backref='user', lazy=True, cascade='all, delete-orphan')
    stories = db.relationship('Story', backref='user', lazy=True, cascade='all, delete-orphan')


class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    jira_project_id = db.Column(db.String(255))
    jira_project_key = db.Column(db.String(50))
    project_name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    stories = db.relationship('Story', backref='project', lazy=True, cascade='all, delete-orphan')


class Story(db.Model):
    __tablename__ = 'stories'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'), nullable=False)
    
    narrative_text = db.Column(db.Text)
    comic_panels = db.Column(db.JSON)  # List of image URLs
    audio_url = db.Column(db.String(500))  # ElevenLabs audio URL
    
    time_range = db.Column(db.String(50))  # "last_sprint", "last_month", etc.
    tone = db.Column(db.String(50))  # "dramatic", "humorous", etc.
    format = db.Column(db.String(50))  # "narrative", "milestone", etc.
    num_panels = db.Column(db.Integer, default=4)
    
    statsig_variant = db.Column(db.String(50))  # Which variant was shown
    engagement_score = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)