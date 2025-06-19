import type { Request } from 'express';

export interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'educator';
  }
}

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  }
}

// Interface for authenticated request with user info
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'student' | 'educator';
  }
}
