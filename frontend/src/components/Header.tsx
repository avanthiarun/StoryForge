import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/projects')}
        >
          <span className="text-3xl font-bold">📖</span>
          <h1 className="text-2xl font-bold">StoryForge</h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-90">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition font-semibold"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};