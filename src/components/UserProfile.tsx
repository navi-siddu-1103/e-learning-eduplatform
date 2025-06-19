import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function UserProfile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    profileImage: '',
    notifications: {
      courseUpdates: true,
      quizReminders: true,
      newCourses: false
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...user!,
      name: formData.name,
      email: formData.email
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checkbox.checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile Settings</h2>
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="profileImage">Profile Image URL</label>
          <input
            type="url"
            id="profileImage"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
          {formData.profileImage && (
            <div className="profile-image-preview">
              <img src={formData.profileImage} alt="Profile preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us about yourself"
          />
        </div>

        <div className="form-group">
          <h3>Notification Preferences</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="courseUpdates"
                checked={formData.notifications.courseUpdates}
                onChange={handleChange}
              />
              Course Updates
            </label>

            <label>
              <input
                type="checkbox"
                name="quizReminders"
                checked={formData.notifications.quizReminders}
                onChange={handleChange}
              />
              Quiz Reminders
            </label>

            <label>
              <input
                type="checkbox"
                name="newCourses"
                checked={formData.notifications.newCourses}
                onChange={handleChange}
              />
              New Course Notifications
            </label>
          </div>
        </div>

        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
}
