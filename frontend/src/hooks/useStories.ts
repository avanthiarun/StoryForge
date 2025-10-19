import { useState, useEffect } from 'react';
import { storyAPI } from '../services/api';
import { Story, GenerateStoryRequest } from '../types';

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = async () => {
    setIsLoading(true);
    try {
      const response = await storyAPI.getAllStories();
      setStories(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch stories');
    } finally {
      setIsLoading(false);
    }
  };

  const generateStory = async (options: GenerateStoryRequest) => {
    setIsLoading(true);
    try {
      const response = await storyAPI.generateStory(options);
      const newStory = response.data.story;
      setStories([newStory, ...stories]);
      setError(null);
      return newStory;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate story');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getStory = async (storyId: string) => {
    try {
      const response = await storyAPI.getStory(storyId);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to fetch story');
    }
  };

  const deleteStory = async (storyId: string) => {
    try {
      await storyAPI.deleteStory(storyId);
      setStories(stories.filter(s => s.id !== storyId));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete story');
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return { stories, isLoading, error, generateStory, getStory, deleteStory, fetchStories };
};