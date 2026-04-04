import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllQuizzes, createQuiz, deleteQuiz } from '../services/api';

/**
 * HostHomePage — Main host area.
 * Shows all saved quizzes with search, create, delete and open.
 * Protected — redirects to login if not authenticated.
 */
function HostHomePage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create quiz form
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  // Check host is logged in
  useEffect(() => {
    if (!localStorage.getItem('hostAuth')) {
      navigate('/host-login');
    }
  }, [navigate]);

  // Load all quizzes
  const fetchQuizzes = async () => {
    try {
      const res = await getAllQuizzes();
      const data = res.data.data || [];
      setQuizzes(data);
      setFiltered(data);
    } catch (err) {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Search filter — runs every time search text changes
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(quizzes);
    } else {
      setFiltered(
        quizzes.filter((q) =>
          q.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, quizzes]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await createQuiz(newTitle.trim());
      const quiz = res.data.data;
      setSuccessMsg(`Quiz "${quiz.title}" created!`);
      setNewTitle('');
      setShowCreate(false);
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchQuizzes();
      // Go straight to the new quiz dashboard
      navigate(`/host/${quiz.id}`);
    } catch (err) {
      setError('Failed to create quiz');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (quizId, quizTitle) => {
    if (!window.confirm(`Delete "${quizTitle}"?\n\nThis will permanently delete the quiz, all its questions, and all player records.`)) return;
    try {
      await deleteQuiz(quizId);
      setSuccessMsg(`"${quizTitle}" deleted.`);
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchQuizzes();
    } catch (err) {
      setError('Failed to delete quiz');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hostAuth');
    navigate('/');
  };

  const statusColor = (status) => {
    if (status === 'CREATED') return '#f59e0b';
    if (status === 'STARTED') return '#10b981';
    return '#ef4444';
  };

  return (
    <div className="host-home">
      {/* Header */}
      <div className="host-home-header">
        <div>
          <h1>🎛️ Host Area</h1>
          <p className="host-home-sub">Manage all your quizzes</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-primary"
            style={{ width: 'auto' }}
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? '✕ Cancel' : '+ Create New Quiz'}
          </button>
          <button
            className="btn btn-secondary"
            style={{ width: 'auto' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="error-banner">{error}</div>}
      {successMsg && <div className="success-banner">{successMsg}</div>}

      {/* Create Quiz Inline Form */}
      {showCreate && (
        <div className="create-quiz-form">
          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Enter quiz title e.g. Java Quiz, Math Quiz..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="input"
              required
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create & Open Dashboard →'}
            </button>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-bar-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search quizzes by name... e.g. java, math, science"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>
            ✕
          </button>
        )}
      </div>

      {/* Quiz Count */}
      <p className="quiz-count">
        {loading ? 'Loading...' : `${filtered.length} quiz${filtered.length !== 1 ? 'zes' : ''} found`}
        {search && ` for "${search}"`}
      </p>

      {/* Quiz List */}
      {loading ? (
        <div className="loading">Loading quizzes...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-quiz-state">
          {search ? (
            <>
              <p>😕 No quizzes found for "<strong>{search}</strong>"</p>
              <button className="btn btn-secondary" style={{ width: 'auto', marginTop: '1rem' }} onClick={() => setSearch('')}>
                Clear Search
              </button>
            </>
          ) : (
            <p>No quizzes yet. Click <strong>+ Create New Quiz</strong> to get started!</p>
          )}
        </div>
      ) : (
        <div className="quiz-list">
          {filtered.map((quiz) => (
            <div key={quiz.id} className="quiz-list-item">
              {/* Left — info */}
              <div className="quiz-list-info">
                <strong className="quiz-list-title">{quiz.title}</strong>
                <span className="quiz-list-id">
                  Quiz ID: <strong>#{quiz.id}</strong> — share this with players
                </span>
              </div>

              {/* Right — status + actions */}
              <div className="quiz-list-actions">
                <span
                  className="status-badge"
                  style={{ background: statusColor(quiz.status) }}
                >
                  {quiz.status}
                </span>
                <button
                  className="btn btn-secondary quiz-list-btn"
                  onClick={() => navigate(`/host/${quiz.id}`)}
                >
                  Open →
                </button>
                <button
                  className="btn quiz-delete-btn"
                  onClick={() => handleDelete(quiz.id, quiz.title)}
                  title="Delete this quiz"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HostHomePage;