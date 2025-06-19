import React from 'react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
}

export function CourseCard({ course, onEnroll }: CourseCardProps) {
  return (
    <div className="course-card">
      <img src={course.imageUrl} alt={course.title} className="course-image" />
      <div className="course-content">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-meta">
          <span className="instructor">By {course.instructor.name}</span>
          <span className="duration">{course.duration}</span>
          <span className={`level level-${course.level.toLowerCase()}`}>
            {course.level}
          </span>
        </div>
        <div className="course-topics">
          {course.topics.map((topic, index) => (
            <span key={index} className="topic-tag">
              {topic}
            </span>
          ))}
        </div>
        {course.enrolled ? (
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${course.progress}%` }}
            />
            <span>{course.progress}% Complete</span>
          </div>
        ) : (
          <button 
            className="enroll-button"
            onClick={() => onEnroll?.(course.id)}
          >
            Enroll Now
          </button>
        )}
      </div>
    </div>
  );
}
