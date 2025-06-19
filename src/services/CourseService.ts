import type { Course } from '../types';

interface CourseProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  completionStatus: 'in-progress' | 'completed';
  completionDate?: Date;
  certificateId?: string;
}

export class CourseService {
  // In a real application, this would interact with a backend API
  private static courseProgress: CourseProgress[] = [];

  static async updateQuizScore(
    userId: string,
    courseId: string,
    quizId: string,
    score: number
  ): Promise<void> {
    let progress = CourseService.courseProgress.find(
      p => p.userId === userId && p.courseId === courseId
    );

    if (!progress) {
      progress = {
        userId,
        courseId,
        completedLessons: [],
        quizScores: {},
        completionStatus: 'in-progress'
      };
      CourseService.courseProgress.push(progress);
    }

    progress.quizScores[quizId] = score;
    
    // Check if course is completed
    await CourseService.checkCourseCompletion(userId, courseId);
  }

  static async markLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<void> {
    let progress = CourseService.courseProgress.find(
      p => p.userId === userId && p.courseId === courseId
    );

    if (!progress) {
      progress = {
        userId,
        courseId,
        completedLessons: [],
        quizScores: {},
        completionStatus: 'in-progress'
      };
      CourseService.courseProgress.push(progress);
    }

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    // Check if course is completed
    await CourseService.checkCourseCompletion(userId, courseId);
  }

  static async checkCourseCompletion(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    const progress = CourseService.courseProgress.find(
      p => p.userId === userId && p.courseId === courseId
    );

    if (!progress) return false;

    // In a real application, you would fetch these from your backend
    const course: Course = {
      id: courseId,
      title: 'Sample Course',
      description: 'Sample Description',
      imageUrl: '',
      instructor: { id: '1', name: 'Instructor' },
      duration: '6 weeks',
      level: 'Beginner',
      topics: [],
      totalLessons: 10, // This would come from your actual course data
      totalQuizzes: 2    // This would come from your actual course data
    };

    const isComplete = 
      progress.completedLessons.length === course.totalLessons &&
      Object.keys(progress.quizScores).length === course.totalQuizzes &&
      Object.values(progress.quizScores).every(score => score >= 70);

    if (isComplete && progress.completionStatus !== 'completed') {
      progress.completionStatus = 'completed';
      progress.completionDate = new Date();
      progress.certificateId = `CERT-${Date.now()}-${userId}-${courseId}`;
    }

    return isComplete;
  }

  static async getCourseProgress(
    userId: string,
    courseId: string
  ): Promise<CourseProgress | undefined> {
    return CourseService.courseProgress.find(
      p => p.userId === userId && p.courseId === courseId
    );
  }
}
