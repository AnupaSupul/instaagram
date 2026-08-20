// src/pages/Login/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Check credentials against json-server
      const res = await fetch(
        `http://localhost:3000/users?username=${username}&password=${password}`
      );
      const users = await res.json();
      if (users.length > 0) {
        // User found - store in localStorage and redirect
        localStorage.setItem('user', JSON.stringify(users[0]));
        navigate('/');
      } else {
        setError('Sorry, your password was incorrect. Please double-check your password.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Instagram Logo */}
        <h1 className="auth-logo">Instagram</h1>
        {/* Login Form */}
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            placeholder="Phone number, username, or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button
            type="submit"
            className="auth-btn"
            disabled={!username || !password || loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        {/* OR Divider */}
        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span>OR</span>
          <div className="auth-divider-line" />
        </div>
        {/* Facebook Login */}
        <button className="auth-facebook">
          <span>🔵</span> Log in with Facebook
        </button>
        {/* Forgot Password */}
        <Link to="/forgot-password" className="auth-forgot">
          Forgot password?
        </Link>
      </div>
      {/* Sign up card */}
      <div className="auth-card auth-card-bottom">
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Sign up</Link>
        </p>
      </div>
      {/* App download prompt */}
      <div className="auth-app-download">
        <p>Get the app.</p>
        <div className="auth-store-badges">
          <span className="auth-badge">App Store</span>
          <span className="auth-badge">Google Play</span>
        </div>
      </div>
    </div>
  );
}
export default Login;