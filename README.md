# StoryForge 🎭

Transform your Jira projects into epic narratives and comic strips! StoryForge uses AI to generate engaging stories from your project data, complete with visual comic strips and audio narration.

## Features

- 🔐 **Atlassian OAuth Integration** - Secure login with your Jira account
- 📖 **AI-Powered Story Generation** - Transform Jira tickets into engaging narratives
- 🎬 **Comic Strip Creation** - Generate visual comic strips from your project stories
- 🎙️ **Audio Narration** - Listen to your stories with AI-generated voice
- 📊 **Multiple Story Formats** - Choose from narrative, milestone, or chaos-to-resolution formats
- 🎭 **Customizable Tone** - Generate stories with different tones (engaging, dramatic, humorous, documentary)

## Tech Stack

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Database (SQLite for development)
- **Google Gemini AI** - Story generation
- **ElevenLabs** - Text-to-speech
- **Atlassian API** - Jira integration
- **Statsig** - Feature flags and analytics

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite works for development)
- Atlassian Developer Account

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   STATSIG_SECRET_KEY=your_statsig_secret_key
   ATLASSIAN_CLIENT_ID=your_atlassian_client_id
   ATLASSIAN_CLIENT_SECRET=your_atlassian_client_secret
   JWT_SECRET_KEY=your_jwt_secret_key
   DATABASE_URL=sqlite:///storyforge.db
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:5000
   ```

5. **Run the backend:**
   ```bash
   python main.py
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

4. **Run the frontend:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `GET /auth/atlassian/authorize` - Get OAuth authorization URL
- `POST /auth/atlassian/callback` - Handle OAuth callback
- `POST /auth/logout` - Logout user

### Projects
- `GET /projects/` - Get user's projects
- `POST /projects/sync` - Sync projects from Jira

### Stories
- `POST /stories/generate` - Generate a new story
- `GET /stories/` - Get all user's stories
- `GET /stories/{id}` - Get specific story
- `DELETE /stories/{id}` - Delete story

### Health
- `GET /health/` - Health check endpoint

## Project Structure

```
StoryForge/
├── backend/
│   ├── auth/           # Authentication modules
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # External service integrations
│   ├── utils/          # Utility functions
│   ├── config.py       # Configuration
│   └── main.py         # Flask app entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── types/      # TypeScript types
│   │   └── utils/      # Utility functions
│   └── public/         # Static assets
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.