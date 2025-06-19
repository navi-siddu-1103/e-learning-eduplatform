import type { Request } from 'express';

export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'educator';
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export type RegisterRequest = Request<Record<string, never>, unknown, RegisterRequestBody>;
export type LoginRequest = Request<Record<string, never>, unknown, LoginRequestBody>;
