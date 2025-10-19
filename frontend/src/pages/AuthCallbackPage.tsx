import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent duplicate calls
      if (hasProcessed.current) {
        return;
      }
      
      hasProcessed.current = true;
      
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code) {
          setError('No authorization code received');
          return;
        }

        console.log('Processing authentication callback...');
        await authService.handleCallback(code);
        
        console.log('Authentication successful, redirecting...');
        // Clear URL parameters and redirect to home
        window.history.replaceState({}, document.title, '/');
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Authentication callback error:', error);
        setError('Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">Completing authentication...</p>
      </div>
    </div>
  );
};
