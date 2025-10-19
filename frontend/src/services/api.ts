import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  getAuthUrl: () => api.get('/auth/atlassian/authorize'),
  callback: (code: string) => api.post('/auth/atlassian/callback', { code }),
  logout: () => api.post('/auth/logout'),
};

export const projectAPI = {
  getProjects: () => api.get('/projects/'),
  getProject: (projectId: string) => api.get(`/projects/${projectId}`),
  syncProjects: () => api.post('/projects/sync'),
};

export const storyAPI = {
  generateStory: (data: any) => api.post('/stories/generate', data),
  getStory: (storyId: string) => api.get(`/stories/${storyId}`),
  getAllStories: () => api.get('/stories/'),
  deleteStory: (storyId: string) => api.delete(`/stories/${storyId}`),
};

export const healthAPI = {
  check: () => api.get('/health/'),
};

export default api;