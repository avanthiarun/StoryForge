const express = require('express');
const cors = require('cors');
const session = require('express-session');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'atlassian-auth-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Atlassian OAuth configuration
const ATLASSIAN_CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID;
const ATLASSIAN_CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET;
const ATLASSIAN_REDIRECT_URI = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`;

// Routes
app.get('/api/auth/atlassian', (req, res) => {
  const authUrl = `https://auth.atlassian.com/authorize?` +
    `audience=api.atlassian.com&` +
    `client_id=${ATLASSIAN_CLIENT_ID}&` +
    `scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-filter%20offline_access&` +
    `redirect_uri=${encodeURIComponent(ATLASSIAN_REDIRECT_URI)}&` +
    `state=${req.sessionID}&` +
    `response_type=code&` +
    `prompt=consent`;

  res.json({ authUrl });
});

app.post('/api/auth/callback', async (req, res) => {
  try {
    const { code, state } = req.body;

    // Exchange code for access token
    const tokenResponse = await axios.post('https://auth.atlassian.com/oauth/token', {
      grant_type: 'authorization_code',
      client_id: ATLASSIAN_CLIENT_ID,
      client_secret: ATLASSIAN_CLIENT_SECRET,
      code: code,
      redirect_uri: ATLASSIAN_REDIRECT_URI
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { access_token, refresh_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://api.atlassian.com/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json'
      }
    });

    const userInfo = userResponse.data;

    // Store tokens in session
    req.session.atlassianAccessToken = access_token;
    req.session.atlassianRefreshToken = refresh_token;
    req.session.user = userInfo;

    res.json({
      success: true,
      user: userInfo,
      message: 'Authentication successful'
    });

  } catch (error) {
    console.error('Authentication error:', error.response?.data || error.message);
    res.status(400).json({
      success: false,
      error: 'Authentication failed',
      details: error.response?.data || error.message
    });
  }
});

app.get('/api/user/profile', (req, res) => {
  if (!req.session.atlassianAccessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    user: req.session.user,
    authenticated: true
  });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
