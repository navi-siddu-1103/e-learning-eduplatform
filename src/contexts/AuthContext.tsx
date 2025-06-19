import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types';
import type { AuthContextType } from './authTypes';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Check if there's a stored session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token with backend in real app
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = (role: UserRole) => {
    // In a real app, this would come from your backend
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: role
    };
    setUser(mockUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context

}


