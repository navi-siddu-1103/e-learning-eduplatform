import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import './components/styles.css'
import { Dashboard } from './pages/Dashboard'
import { CourseList } from './pages/CourseList'
import { CreateCourse } from './pages/CreateCourse'
import { UserProfile } from './components/UserProfile'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AppContent() {
  const { isLoggedIn, user, login, logout } = useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <h1><Link to="/" className="logo-link">E-Learning Platform</Link></h1>
        <nav>
          {!isLoggedIn ? (
            <div className="auth-buttons">
              <button onClick={() => login('student')}>Login as Student</button>
              <button onClick={() => login('educator')}>Login as Educator</button>
            </div>
          ) : (
            <div className="nav-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/courses">Courses</Link>
              {user?.role === 'educator' && <Link to="/create-course">Create Course</Link>}
              <Link to="/profile">Profile</Link>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={
            !isLoggedIn ? (
              <div className="welcome-section">
                <h2>Welcome to Our E-Learning Platform</h2>
                <p>Join us to access a world of knowledge and interactive learning experiences.</p>
                <div className="feature-grid">
                  <div className="feature">
                    <h3>Interactive Courses</h3>
                    <p>Learn at your own pace with our interactive course material</p>
                  </div>
                  <div className="feature">
                    <h3>Progress Tracking</h3>
                    <p>Monitor your learning journey with detailed progress tracking</p>
                  </div>
                  <div className="feature">
                    <h3>Expert Educators</h3>
                    <p>Learn from industry experts and experienced educators</p>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/src/pages/Dashboard.tsx" replace />
            )
          } />
          <Route 
            path="/dashboard" 
            element={isLoggedIn ? <Dashboard user={user!} /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/courses" 
            element={isLoggedIn ? <CourseList /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/create-course" 
            element={
              isLoggedIn && user?.role === 'educator' 
                ? <CreateCourse /> 
                : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/profile" 
            element={isLoggedIn ? <UserProfile /> : <Navigate to="/" replace />} 
          />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 E-Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App
