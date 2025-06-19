import type { Request } from 'express';

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'educator';
  password?: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'student' | 'educator';
  };
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'educator';
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterRequest extends Request {
  body: RegisterBody;
}

export interface LoginRequest extends Request {
  body: LoginBody;
}
