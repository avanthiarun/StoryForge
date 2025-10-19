from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models.database import db
from routes.auth_routes import auth_bp
from routes.project_routes import project_bp
from routes.story_routes import story_bp
from routes.health_routes import health_bp
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Set SQLAlchemy database URI
    app.config['SQLALCHEMY_DATABASE_URI'] = Config.DATABASE_URL
    
    # Set JWT secret key
    app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET_KEY
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, resources={
        r"/*": {
            "origins": [Config.FRONTEND_URL],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(project_bp)
    app.register_blueprint(story_bp)
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)