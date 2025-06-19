import { useState } from 'react';
import type { Course } from '../types';

export function CreateCourse() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    duration: '',
    level: 'Beginner' as const,
    topics: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        throw new Error('Title and description are required');
      }

      // Validate URL
      try {
        new URL(formData.imageUrl);
      } catch {
        throw new Error('Please enter a valid image URL');
      }

      const newCourse: Course = {
        id: crypto.randomUUID(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl,
        duration: formData.duration.trim(),
        level: formData.level,
        topics: formData.topics.split(',').map(topic => topic.trim()).filter(Boolean),
        instructor: {
          id: 'current-user-id', // To be replaced with actual auth context
          name: 'Current User Name' // To be replaced with actual auth context
        },
        totalLessons: 0, // Initial value for new course
        totalQuizzes: 0  // Initial value for new course
      };

      // Here you would typically make an API call to save the course
      console.log('Creating course:', newCourse);
      
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        duration: '',
        level: 'Beginner' as const,
        topics: ''
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  return (
    <div className="create-course-container">
      <h2>Create New Course</h2>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label htmlFor="title">Course Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter course title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter course description"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Course Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            placeholder="Enter course image URL"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              placeholder="e.g., 6 weeks"
            />
          </div>

          <div className="form-group">
            <label htmlFor="level">Level</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="topics">Topics (comma-separated)</label>
          <input
            type="text"
            id="topics"
            name="topics"
            value={formData.topics}
            onChange={handleChange}
            required
            placeholder="e.g., React, JavaScript, Web Development"
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Course...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
}
