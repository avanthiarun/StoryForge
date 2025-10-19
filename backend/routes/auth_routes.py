from flask import Blueprint, request, jsonify, current_app
from models.database import db, User
from auth.atlassian_oauth import get_atlassian_auth_url, exchange_code_for_token, get_user_info, get_user_cloud_id
from auth.jwt_handler import create_access_token
import os

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/atlassian/authorize', methods=['GET'])
def atlassian_authorize():
    """Redirect to Atlassian OAuth"""
    import uuid
    from config import Config
    
    client_id = Config.ATLASSIAN_CLIENT_ID
    redirect_uri = f"{current_app.config['FRONTEND_URL']}/auth/callback"
    state = str(uuid.uuid4())  # Generate unique state
    
    auth_url = get_atlassian_auth_url(client_id, redirect_uri, state)
    return jsonify({"auth_url": auth_url})


@auth_bp.route('/atlassian/callback', methods=['POST'])
def atlassian_callback():
    """Handle Atlassian OAuth callback"""
    from config import Config
    
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
            
        code = data.get('code')
        if not code:
            return jsonify({"error": "No authorization code"}), 400
        
        print(f"Received code: {code[:10]}...")  # Debug log
        
        # Exchange code for token
        client_id = Config.ATLASSIAN_CLIENT_ID
        client_secret = Config.ATLASSIAN_CLIENT_SECRET
        redirect_uri = f"{current_app.config['FRONTEND_URL']}/auth/callback"
        
        print(f"Exchanging token with client_id: {client_id[:10]}...")  # Debug log
        
        token_response = exchange_code_for_token(code, client_id, client_secret, redirect_uri)
        print(f"Token response: {token_response}")  # Debug log
        
        if 'error' in token_response:
            return jsonify({"error": token_response.get('error_description', 'Token exchange failed')}), 400
            
        access_token = token_response.get('access_token')
        if not access_token:
            return jsonify({"error": "No access token received"}), 400
        
        # Get user info
        print("Getting user info...")  # Debug log
        user_info = get_user_info(access_token)
        print(f"User info: {user_info}")  # Debug log
        
        if 'error' in user_info:
            return jsonify({"error": "Failed to get user info"}), 400
        
        cloud_id = get_user_cloud_id(access_token)
        print(f"Cloud ID: {cloud_id}")  # Debug log
        
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
        print(f"Callback error: {str(e)}")  # Debug log
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    return jsonify({"success": True, "message": "Logged out"})