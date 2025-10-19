import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (authUrl: string) => {
    window.location.href = authUrl;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated(),
  };
};