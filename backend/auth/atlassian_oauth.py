import requests
from flask import current_app
import base64

ATLASSIAN_AUTH_URL = "https://auth.atlassian.com/authorize"
ATLASSIAN_TOKEN_URL = "https://auth.atlassian.com/oauth/token"
ATLASSIAN_USER_URL = "https://api.atlassian.com/me"

def get_atlassian_auth_url(client_id, redirect_uri, state=None):
    """Generate OAuth authorization URL"""
    import urllib.parse
    
    params = {
        "audience": "api.atlassian.com",
        "client_id": client_id,
        "scope": "read:jira-work read:jira-user offline_access",
        "redirect_uri": redirect_uri,
        "state": state or "random_state_string",
        "response_type": "code",
        "prompt": "consent"
    }
    
    # URL encode the parameters
    query_string = urllib.parse.urlencode(params)
    return f"{ATLASSIAN_AUTH_URL}?{query_string}"


def exchange_code_for_token(code, client_id, client_secret, redirect_uri):
    """Exchange authorization code for access token"""
    import json
    
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "grant_type": "authorization_code",
        "client_id": client_id,
        "client_secret": client_secret,
        "code": code,
        "redirect_uri": redirect_uri
    }
    
    response = requests.post(ATLASSIAN_TOKEN_URL, headers=headers, json=data)
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