import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleCallback(code);
    }
  }, []);

  const handleCallback = async (code: string) => {
    setIsLoading(true);
    try {
      await authService.handleCallback(code);
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const authUrl = await authService.getAuthUrl();
      login(authUrl);
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to initiate login. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">Authenticating with Atlassian...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">StoryForge</h1>
          <p className="text-gray-600">
            Transform your Jira projects into epic narratives
          </p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Sign in with Atlassian
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your Jira account to start creating amazing project stories
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              <span>🔗</span>
              <span>Continue with Atlassian</span>
            </div>
          </button>

          <div className="text-center text-sm text-gray-500">
            <p>
              By signing in, you agree to connect your Jira account to StoryForge.
              We'll only access your project data to generate stories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
