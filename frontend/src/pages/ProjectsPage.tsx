import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ProjectsPage: React.FC = () => {
  const { projects, isLoading, error, syncProjects } = useProjects();
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">Your Projects</h1>
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
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No projects found
            </h2>
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
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
