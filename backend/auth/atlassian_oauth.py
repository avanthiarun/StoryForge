import requests
from flask import current_app
import base64

ATLASSIAN_AUTH_URL = "https://auth.atlassian.com/authorize"
ATLASSIAN_TOKEN_URL = "https://auth.atlassian.com/oauth/token"
ATLASSIAN_USER_URL = "https://api.atlassian.com/me"

def get_atlassian_auth_url(client_id, redirect_uri):
    """Generate OAuth authorization URL"""
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "read:jira-work read:confluence-content write:confluence-content offline_access",
        "state": "random_state_string"
    }
    return f"{ATLASSIAN_AUTH_URL}?{'&'.join([f'{k}={v}' for k, v in params.items()])}"


def exchange_code_for_token(code, client_id, client_secret, redirect_uri):
    """Exchange authorization code for access token"""
    auth = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    
    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri
    }
    
    response = requests.post(ATLASSIAN_TOKEN_URL, headers=headers, data=data)
    return response.json()


def get_user_info(access_token):
    """Get user info from Atlassian"""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(ATLASSIAN_USER_URL, headers=headers)
    return response.json()


def get_user_cloud_id(access_token):
    """Get user's Atlassian cloud ID"""
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.get("https://api.atlassian.com/oauth/token/accessible-resources", headers=headers)
    resources = response.json()
    
    if resources:
        return resources[0]['id']
    return None