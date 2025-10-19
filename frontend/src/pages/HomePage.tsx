import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const HomePage: React.FC = () => {
  const { projects, isLoading, syncProjects } = useProjects();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncProjects = async () => {
    setIsSyncing(true);
    try {
      await syncProjects();
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🎭 StoryForge
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your Jira projects into epic narratives and comic strips
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={handleSyncProjects}
              disabled={isSyncing}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSyncing ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Syncing...</span>
                </div>
              ) : (
                '🔄 Sync Projects'
              )}
            </button>
            
            <Link
              to="/projects"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              📁 View All Projects
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Your Projects
          </h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500 mb-6">
                Sync your Jira projects to get started creating stories
              </p>
              <button
                onClick={handleSyncProjects}
                disabled={isSyncing}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {isSyncing ? 'Syncing...' : 'Sync Projects'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            What can StoryForge do?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Epic Narratives
              </h3>
              <p className="text-gray-600">
                Transform your Jira tickets into engaging stories with different tones and formats
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Comic Strips
              </h3>
              <p className="text-gray-600">
                Generate visual comic strips that bring your project stories to life
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🎙️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Audio Narration
              </h3>
              <p className="text-gray-600">
                Listen to your stories with AI-generated voice narration
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
