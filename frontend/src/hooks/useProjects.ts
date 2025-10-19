import { useState, useEffect } from 'react';
import { projectAPI } from '../services/api';
import { Project } from '../types';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await projectAPI.getProjects();
      setProjects(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch projects');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const syncProjects = async () => {
    setIsLoading(true);
    try {
      await projectAPI.syncProjects();
      await fetchProjects();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to sync projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, isLoading, error, fetchProjects, syncProjects };
};