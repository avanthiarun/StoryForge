import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useStories } from '../hooks/useStories';
import { StoryGenerator } from '../components/StoryGenerator';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { GenerateStoryRequest } from '../types';

export const GenerateStoryPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { generateStory, isLoading: storyLoading } = useStories();
  
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const foundProject = projects.find(p => p.id === projectId);
      setProject(foundProject);
    }
  }, [projectId, projects]);

  const handleGenerateStory = async (options: GenerateStoryRequest) => {
    try {
      const story = await generateStory(options);
      if (story) {
        navigate(`/story/${story.id}`);
      }
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate story. Please try again.');
    }
  };

  if (projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Project not found
          </h2>
          <p className="text-gray-500 mb-6">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Generate Story for {project.name}
          </h1>
          <p className="text-gray-600">
            Transform your Jira project into an epic narrative
          </p>
        </div>

        {/* Story Generator Form */}
        <StoryGenerator
          projectId={projectId!}
          onGenerate={handleGenerateStory}
          isLoading={storyLoading}
        />

        {/* Project Info */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              About this Project
            </h3>
            <div className="space-y-2">
              <p><strong>Project Key:</strong> {project.key}</p>
              <p><strong>Description:</strong> {project.description || 'No description available'}</p>
              <p><strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
