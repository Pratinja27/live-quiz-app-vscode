import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hostLogin } from '../services/api';

/**
 * HostLoginPage — Simple login for hosts.
 * Credentials are checked against backend hardcoded values.
 * On success, stores "hostAuth" in localStorage so host
 * stays logged in on page refresh.
 */
function HostLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await hostLogin(username, password);
      // Save auth flag in localStorage so host stays logged in
      localStorage.setItem('hostAuth', 'true');
      navigate('/host-home');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <div className="join-card">
        <div className="join-icon">🔐</div>
        <h1>Host Login</h1>
        <p>Enter your host credentials to manage quizzes.</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-large"
            required
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-large"
            required
          />
          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>
        {error && <div className="error-banner">{error}</div>}
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Default: admin / host123
        </p>
      </div>
    </div>
  );
}

export default HostLoginPage;