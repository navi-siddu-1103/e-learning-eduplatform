import type { User, UserRole } from '../types';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}
