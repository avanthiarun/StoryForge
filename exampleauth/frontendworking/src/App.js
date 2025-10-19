import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthStatus();
    
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      handleOAuthCallback(code, state);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      // User not authenticated, this is normal
      console.log('User not authenticated');
    }
  };

  const handleOAuthCallback = async (code, state) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/auth/callback', {
        code,
        state
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        setSuccess('Successfully authenticated with Atlassian!');
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
      console.error('OAuth callback error:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiateAtlassianAuth = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.get('/api/auth/atlassian');
      window.location.href = response.data.authUrl;
    } catch (error) {
      setError('Failed to initiate authentication. Please try again.');
      console.error('Auth initiation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      setSuccess('Logged out successfully!');
    } catch (error) {
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>Atlassian Authentication Demo</h1>
          <p>Connect your Atlassian account to get started</p>
        </header>

        <div className="card">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <span>Processing...</span>
            </div>
          )}

          {!user ? (
            <div className="auth-section">
              <h2>Welcome!</h2>
              <p>To access Atlassian services, please authenticate with your Atlassian account.</p>
              <button 
                className="btn" 
                onClick={initiateAtlassianAuth}
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Connect with Atlassian'}
              </button>
            </div>
          ) : (
            <div className="user-section">
              <h2>Welcome back!</h2>
              <div className="user-info">
                <h3>User Profile</h3>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Account ID:</strong> {user.account_id}</p>
                <p><strong>Account Type:</strong> {user.account_type}</p>
                {user.picture && (
                  <div className="user-avatar">
                    <img src={user.picture} alt="Profile" style={{width: '60px', height: '60px', borderRadius: '50%'}} />
                  </div>
                )}
              </div>
              
              <div className="actions">
                <button className="btn btn-danger" onClick={logout} disabled={loading}>
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3>About This Demo</h3>
          <p>This application demonstrates Atlassian OAuth 2.0 authentication flow using:</p>
          <ul>
            <li><strong>Backend:</strong> Node.js with Express</li>
            <li><strong>Frontend:</strong> React</li>
            <li><strong>Authentication:</strong> Atlassian OAuth 2.0</li>
            <li><strong>Session Management:</strong> Express sessions</li>
          </ul>
          <p>The app requests permissions to read Jira work, manage projects, and access user profile information.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
