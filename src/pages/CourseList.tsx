import { useState, useEffect } from 'react';
import type { Course } from '../types';
import { CourseCard } from '../components/CourseCard';

export function CourseList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      // Temporary: Use static courses data
      return [
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
      level: 'Beginner' as const,
      topics: ['React', 'JavaScript', 'Web Development'],
      totalLessons: 10,
      totalQuizzes: 3,
      completionStatus: 'not-started' as 'not-started' | 'in-progress' | 'completed',
      progress: 0
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
      level: 'Advanced' as const,
      topics: ['JavaScript', 'ES6+', 'Design Patterns'],
      totalLessons: 12,
      totalQuizzes: 4,
      completionStatus: 'not-started' as 'not-started' | 'in-progress' | 'completed',
      progress: 0
    },
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
      level: 'Intermediate' as const,
      topics: ['TypeScript', 'JavaScript', 'Static Typing'],
      totalLessons: 8,
      totalQuizzes: 2,
      completionStatus: 'not-started' as 'not-started' | 'in-progress' | 'completed',
      progress: 0
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
      level: 'Intermediate' as const,
      topics: ['Node.js', 'Express', 'Backend Development'],
      totalLessons: 15,
      totalQuizzes: 5,
      completionStatus: 'not-started' as 'not-started' | 'in-progress' | 'completed',
      progress: 0
    }
  ];
    } catch (err) {
      setError(`Failed to fetch courses: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses().then(setCourses);
  }, []);

  const allTopics = Array.from(new Set(courses.flatMap(course => course.topics)));

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    const matchesTopic = !selectedTopic || course.topics.includes(selectedTopic);
    
    return matchesSearch && matchesLevel && matchesTopic;
  });

  const handleEnroll = (courseId: string) => {
    // Handle enrollment logic here
    console.log(`Enrolling in course ${courseId}`);
  };

  return (
    <div className="course-list-container">      <div className="course-list-header">
        <div className="header-top">
          <h2>Available Courses</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search courses, topics, or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="level-select">Course Level:</label>
            <select
              id="level-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="filter-select"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="topic-select">Topic:</label>
            <select
              id="topic-select"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="filter-select"
            >
              <option value="">All Topics</option>
              {allTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {(selectedLevel || selectedTopic || searchTerm) && (
            <button 
              className="clear-filters"
              onClick={() => {
                setSelectedLevel('');
                setSelectedTopic('');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
          <button className="error-dismiss" onClick={() => setError(null)}>✕</button>
        </div>
      )}      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : (
        <>
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No courses found</h3>
              <p>
                {searchTerm ? 
                  `No courses found matching "${searchTerm}"` :
                  'No courses found matching your criteria.'
                }
              </p>
              <button 
                className="clear-filters"
                onClick={() => {
                  setSelectedLevel('');
                  setSelectedTopic('');
                  setSearchTerm('');
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
