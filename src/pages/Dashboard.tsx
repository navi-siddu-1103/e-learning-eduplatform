import type { Course, User } from '../types';
import { CourseCard } from '../components/CourseCard';

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const enrolledCourses: Course[] = [
    {
      id: '1',
      title: 'Introduction to React',
      description: 'Learn the basics of React including components, props, and state.',
      imageUrl: '/images/courses/react-basics.jpg',
      instructor: {
        id: '101',
        name: 'John Doe'
      },
      duration: '6 weeks',
      level: 'Beginner',      topics: ['React', 'JavaScript', 'Web Development'],
      enrolled: true,
      progress: 65,
      totalLessons: 10,
      totalQuizzes: 2
    },
    {
      id: '2',
      title: 'Advanced JavaScript Concepts',
      description: 'Deep dive into advanced JavaScript features and patterns.',
      imageUrl: '/images/courses/advanced-js.jpg',
      instructor: {
        id: '102',
        name: 'Jane Smith'
      },
      duration: '8 weeks',
      level: 'Advanced',      topics: ['JavaScript', 'ES6+', 'Design Patterns'],
      enrolled: true,
      progress: 30,
      totalLessons: 12,
      totalQuizzes: 3
    }
  ];
  const recommendedCourses: Course[] = [
    {
      id: '3',
      title: 'TypeScript Fundamentals',
      description: 'Master TypeScript and static typing in JavaScript.',
      imageUrl: '/images/courses/typescript.jpg',
      instructor: {
        id: '103',
        name: 'Mike Johnson'
      },
      duration: '4 weeks',
      level: 'Intermediate',      topics: ['TypeScript', 'JavaScript', 'Static Typing'],
      enrolled: false,
      totalLessons: 8,
      totalQuizzes: 2
    },
    {
      id: '4',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express.',
      imageUrl: '/images/courses/nodejs.jpg',
      instructor: {
        id: '104',
        name: 'Sarah Wilson'
      },
      duration: '10 weeks',
      level: 'Intermediate',      topics: ['Node.js', 'Express', 'MongoDB', 'REST API'],
      enrolled: false,
      totalLessons: 15,
      totalQuizzes: 4
    }
  ];

  const handleEnroll = (courseId: string) => {
    console.log(`Enrolling in course ${courseId}`);
    // Handle enrollment logic here
  };
  const totalHoursSpent = enrolledCourses.length * 2; // Placeholder calculation
  const lastLoginDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>Welcome back, {user.name}! 👋</h2>
            <p>Continue your learning journey</p>
            <span className="last-login">Last login: {lastLoginDate}</span>
          </div>
          <div className="quick-actions">
            <button className="action-button">
              <span className="action-icon">📝</span>
              Resume Learning
            </button>
            <button className="action-button secondary">
              <span className="action-icon">🔍</span>
              Browse Courses
            </button>
          </div>
        </div>
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon primary">📚</div>
            <div className="stat-content">
              <h3>Courses in Progress</h3>
              <p className="stat-number">{enrolledCourses.length}</p>
              <span className="stat-trend positive">+2 this month</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">📈</div>
            <div className="stat-content">
              <h3>Average Progress</h3>
              <p className="stat-number">
                {Math.round(
                  enrolledCourses.reduce((acc, course) => acc + (course.progress || 0), 0) /
                  enrolledCourses.length
                )}%
              </p>
              <div className="progress-bar">                <div 
                  className={`progress-fill w-${Math.round(
                    enrolledCourses.reduce((acc, course) => acc + (course.progress || 0), 0) /
                    enrolledCourses.length
                  )}`}
                />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon warning">⏱️</div>
            <div className="stat-content">
              <h3>Hours Spent</h3>
              <p className="stat-number">{totalHoursSpent}h</p>
              <span className="stat-trend">This week</span>
            </div>
          </div>
        </div>
      </div>      <div className="dashboard-content">
        <section className="dashboard-section enrolled-courses">
          <div className="section-header">
            <div className="section-title">
              <h3>Your Courses</h3>
              <span className="section-subtitle">Continue where you left off</span>
            </div>
            <div className="section-actions">
              <div className="search-filter">
                <input 
                  type="text" 
                  placeholder="Search your courses..."
                  className="search-input"
                />                <select 
                  className="filter-select"
                  title="Filter courses"
                  aria-label="Filter courses by status"
                >
                  <option value="all">All Courses</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button className="view-all-button">View All</button>
            </div>
          </div>
          <div className="courses-grid">
            {enrolledCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
            <div className="add-course-card">
              <div className="add-course-content">
                <span className="add-icon">+</span>
                <p>Discover New Courses</p>
              </div>
            </div>
          </div>
        </section>

        {user.role === 'student' && (
          <section className="dashboard-section recommended-courses">
            <div className="section-header">
              <div className="section-title">
                <h3>Recommended for You</h3>
                <span className="section-subtitle">Based on your interests</span>
              </div>
              <button className="view-all-button">Browse More</button>
            </div>
            <div className="courses-grid">
              {recommendedCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          </section>
        )}

        <section className="dashboard-section quick-stats">
          <div className="quick-stats-grid">
            <div className="achievement-card">
              <div className="achievement-icon">🏆</div>
              <h4>Recent Achievement</h4>
              <p>Completed 2 courses this month</p>
            </div>
            <div className="streak-card">
              <div className="streak-icon">🔥</div>
              <h4>Learning Streak</h4>
              <p>5 days in a row</p>
            </div>
            <div className="next-goal-card">
              <div className="goal-icon">🎯</div>
              <h4>Next Goal</h4>
              <p>Complete Advanced JS course</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
