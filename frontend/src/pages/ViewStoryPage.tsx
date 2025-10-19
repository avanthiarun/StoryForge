import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStories } from '../hooks/useStories';
import { StoryDisplay } from '../components/StoryDisplay';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ViewStoryPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { getStory, deleteStory, isLoading } = useStories();
  
  const [story, setStory] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (storyId) {
      loadStory();
    }
  }, [storyId]);

  const loadStory = async () => {
    try {
      const storyData = await getStory(storyId!);
      setStory(storyData);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load story');
    }
  };

  const handleDeleteStory = async () => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await deleteStory(storyId!);
        navigate('/projects');
      } catch (error) {
        console.error('Error deleting story:', error);
        alert('Failed to delete story. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Story not found
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
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

  if (!story) {
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
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Your Generated Story
              </h1>
              <p className="text-gray-600">
                Created on {new Date(story.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/projects')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Back to Projects
              </button>
              <button
                onClick={handleDeleteStory}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Delete Story
              </button>
            </div>
          </div>

          {/* Story Metadata */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-600">Tone:</span>
                <span className="ml-2 font-semibold capitalize">{story.tone}</span>
              </div>
              <div>
                <span className="text-gray-600">Format:</span>
                <span className="ml-2 font-semibold capitalize">{story.format}</span>
              </div>
              <div>
                <span className="text-gray-600">Panels:</span>
                <span className="ml-2 font-semibold">{story.num_panels}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Story Display */}
        <StoryDisplay story={story} />
      </div>
    </div>
  );
};
