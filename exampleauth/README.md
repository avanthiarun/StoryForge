# Atlassian Authentication Demo

A full-stack application demonstrating Atlassian OAuth 2.0 authentication with React frontend and Node.js backend.

## Features

- **Atlassian OAuth 2.0 Integration**: Complete authentication flow with Atlassian
- **Modern UI**: Beautiful, responsive React interface
- **Session Management**: Secure session handling with Express
- **User Profile Display**: Shows authenticated user information
- **Error Handling**: Comprehensive error handling and user feedback

## Project Structure

```
atlassian-auth-app/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── index.css
├── package.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Install all dependencies (root, backend, and frontend)
npm run install-all
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory with your Atlassian credentials:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your actual credentials:

```env
ATLASSIAN_API_TOKEN=your_api_token_here
ATLASSIAN_CLOUD_ID=your_cloud_id_here
ATLASSIAN_CLIENT_ID=your_client_id_here
ATLASSIAN_CLIENT_SECRET=your_client_secret_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Atlassian App Configuration

1. Go to [Atlassian Developer Console](https://developer.atlassian.com/console/myapps/)
2. Create a new OAuth 2.0 app
3. Set the callback URL to: `http://localhost:3000/auth/callback`
4. Configure the required scopes:
   - `read:jira-work`
   - `manage:jira-project`
   - `manage:jira-configuration`
   - `write:jira-work`
   - `manage:jira-webhook`
   - `manage:jira-filter`
   - `offline_access`

### 4. Run the Application

```bash
# Start both frontend and backend concurrently
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run frontend
```

## Usage

1. **Start the application**: Run `npm run dev`
2. **Open your browser**: Navigate to `http://localhost:3000`
3. **Authenticate**: Click "Connect with Atlassian" button
4. **Authorize**: Complete the OAuth flow in the Atlassian authorization page
5. **View Profile**: See your authenticated user information

## API Endpoints

### Backend (Port 3001)

- `GET /api/auth/atlassian` - Get Atlassian OAuth URL
- `POST /api/auth/callback` - Handle OAuth callback
- `GET /api/user/profile` - Get authenticated user profile
- `POST /api/auth/logout` - Logout user
- `GET /api/health` - Health check

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client
- **Express Session** - Session management
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI framework
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

## Security Features

- **OAuth 2.0 Flow**: Secure authentication with Atlassian
- **Session Management**: Server-side session storage
- **CORS Protection**: Configured for specific origins
- **Environment Variables**: Sensitive data stored securely
- **HTTPS Ready**: Production-ready security configuration

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` in `.env` matches your frontend URL
2. **Authentication Fails**: Verify Atlassian app configuration and callback URL
3. **Session Issues**: Check that cookies are enabled in your browser
4. **Port Conflicts**: Ensure ports 3000 and 3001 are available

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for demonstration purposes. Please ensure you comply with Atlassian's terms of service when using their APIs.
