from flask import Blueprint, request, jsonify, current_app
from models.database import db, User
from auth.atlassian_oauth import get_atlassian_auth_url, exchange_code_for_token, get_user_info, get_user_cloud_id
from auth.jwt_handler import create_access_token
import os

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/atlassian/authorize', methods=['GET'])
def atlassian_authorize():
    """Redirect to Atlassian OAuth"""
    client_id = os.getenv("ATLASSIAN_CLIENT_ID")
    redirect_uri = f"{current_app.config['BACKEND_URL']}/auth/atlassian/callback"
    auth_url = get_atlassian_auth_url(client_id, redirect_uri)
    return jsonify({"auth_url": auth_url})


@auth_bp.route('/atlassian/callback', methods=['POST'])
def atlassian_callback():
    """Handle Atlassian OAuth callback"""
    data = request.json
    code = data.get('code')
    
    if not code:
        return jsonify({"error": "No authorization code"}), 400
    
    try:
        # Exchange code for token
        client_id = os.getenv("ATLASSIAN_CLIENT_ID")
        client_secret = os.getenv("ATLASSIAN_CLIENT_SECRET")
        redirect_uri = f"{current_app.config['BACKEND_URL']}/auth/atlassian/callback"
        
        token_response = exchange_code_for_token(code, client_id, client_secret, redirect_uri)
        access_token = token_response.get('access_token')
        
        # Get user info
        user_info = get_user_info(access_token)
        cloud_id = get_user_cloud_id(access_token)
        
        # Create or update user in database
        user = User.query.filter_by(email=user_info['email']).first()
        
        if not user:
            user = User(
                email=user_info['email'],
                atlassian_user_id=user_info['account_id'],
                atlassian_access_token=access_token,
                cloud_id=cloud_id
            )
            db.session.add(user)
        else:
            user.atlassian_access_token = access_token
            user.cloud_id = cloud_id
        
        db.session.commit()
        
        # Create JWT token
        jwt_token = create_access_token({"user_id": user.id, "email": user.email})
        
        return jsonify({
            "success": True,
            "token": jwt_token,
            "user": {
                "id": user.id,
                "email": user.email
            }
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    return jsonify({"success": True, "message": "Logged out"})