export type UserRole = 'student' | 'educator' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Quiz {
  id: string;
  title: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  quiz?: Quiz;
  completed?: boolean;
  progress?: number;
  duration?: string;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
  progress?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  instructor: {
    id: string;
    name: string;
  };
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  enrolled?: boolean;
  progress?: number;
  totalLessons: number;
  totalQuizzes: number;
  completionStatus?: 'not-started' | 'in-progress' | 'completed';
  completionDate?: Date;
  certificateId?: string;
  lastAccessedModuleId?: string;
  lastAccessedLessonId?: string;
  modules?: Module[];
}
