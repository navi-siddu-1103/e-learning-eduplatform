import { useState } from 'react';
import type { Quiz, Course, User } from '../types';
import { QuizComponent } from './QuizComponent';

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  quiz?: Quiz;
  completed?: boolean;
  progress?: number;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseContentProps {
  modules: Module[];
  course: Course;
  user: User;
  onComplete: (moduleId: string, lessonId: string) => void;
}

export function CourseContent({ modules, course, user, onComplete }: CourseContentProps) {
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleLessonComplete = async (moduleId: string, lessonId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      setCompletedLessons(prev => new Set(prev.add(lessonId)));
      await onComplete(moduleId, lessonId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete lesson');
      setCompletedLessons(prev => {
        const newSet = new Set(prev);
        newSet.delete(lessonId);
        return newSet;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = (score: number) => {
    if (score >= 70) { // Pass threshold
      const currentLesson = modules[activeModule].lessons[activeLesson];
      handleLessonComplete(modules[activeModule].id, currentLesson.id);
    }
  };

  const currentLesson = modules[activeModule].lessons[activeLesson];

  const calculateModuleProgress = (moduleIndex: number) => {
    const module = modules[moduleIndex];
    const completedCount = module.lessons.filter(lesson => 
      completedLessons.has(lesson.id)
    ).length;
    return Math.round((completedCount / module.lessons.length) * 100);
  };

  return (
    <div className="course-content">
      <div className="modules-sidebar">
        {modules.map((module, moduleIndex) => (
          <div key={module.id} className="module-item">
            <h3 
              className={`module-title ${moduleIndex === activeModule ? 'active' : ''}`}
              onClick={() => setActiveModule(moduleIndex)}
            >
              {module.title}
            </h3>
            {moduleIndex === activeModule && (
              <div className="module-content">
                <div className="module-progress">
                  <div 
                    className="progress-bar"
                    data-progress={calculateModuleProgress(moduleIndex)}
                  >
                    <div className="progress-fill" />
                  </div>
                  <span className="progress-text">
                    {module.lessons.filter(lesson => 
                      completedLessons.has(lesson.id)
                    ).length} / {module.lessons.length} lessons
                  </span>
                </div>
                <div className="lesson-list">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className={`lesson-item ${lessonIndex === activeLesson ? 'active' : ''} ${
                        completedLessons.has(lesson.id) ? 'completed' : ''
                      }`}
                      onClick={() => setActiveLesson(lessonIndex)}
                    >
                      {lesson.title}
                      {completedLessons.has(lesson.id) && (
                        <span className="checkmark">✓</span>
                      )}
                    </div>
                  ))}                </div>
              </div>
            )}
          </div>
        ))}
      </div>      <div className="lesson-content">
        {error && (
          <div className="error-message" role="alert">
            {error}
            <button 
              className="error-dismiss"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}
        
        <h2>{currentLesson.title}</h2>
        
        {currentLesson.videoUrl && (
          <div className="video-container">
            <video
              controls
              src={currentLesson.videoUrl}
              className="lesson-video"
            />
          </div>
        )}

        <div className="lesson-text">
          {currentLesson.content}
        </div>

        {currentLesson.quiz && (
          <div className="lesson-quiz">
            <h3>Lesson Quiz</h3>            <QuizComponent 
              quiz={currentLesson.quiz}
              course={course}
              user={user}
              onComplete={handleQuizComplete}
            />
          </div>
        )}

        <div className="lesson-navigation">
          <button
            disabled={activeLesson === 0}
            onClick={() => setActiveLesson(prev => prev - 1)}
          >
            Previous Lesson
          </button>
            {!currentLesson.quiz && (
            <button
              className={`complete-button ${isLoading ? 'loading' : ''}`}
              onClick={() => handleLessonComplete(
                modules[activeModule].id,
                currentLesson.id
              )}
              disabled={isLoading}
            >
              {isLoading ? 'Marking as Complete...' : 'Mark as Complete'}
            </button>
          )}

          <button
            disabled={activeLesson === modules[activeModule].lessons.length - 1}
            onClick={() => setActiveLesson(prev => prev + 1)}
          >
            Next Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
