import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

interface LocationState {
  message?: string;
  from?: string;
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(
    locationState?.message || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Login successful - store the token
      localStorage.setItem('token', data.token);
      
      // Redirect to the intended page or dashboard
      navigate(locationState?.from || '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        
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

        {success && (
          <div className="success-message" role="alert">
            {success}
            <button 
              className="success-dismiss"
              onClick={() => setSuccess(null)}
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="auth-links">
          <a href="/forgot-password" className="auth-link">
            Forgot your password?
          </a>
          <p>
            Don't have an account?{' '}
            <a href="/register" className="auth-link">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
