import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz, getAllQuizzes } from '../services/api';

function HomePage() {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('');
  const [joinQuizId, setJoinQuizId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);

  // Load all saved quizzes when page opens
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await getAllQuizzes();
        setSavedQuizzes(res.data.data || []);
      } catch (err) {
        console.error('Could not load quizzes');
      } finally {
        setLoadingQuizzes(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await createQuiz(quizTitle);
      const quiz = response.data.data;
      navigate(`/host/${quiz.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQuiz = (e) => {
    e.preventDefault();
    if (!joinQuizId.trim()) return;
    navigate(`/player/${joinQuizId}`);
  };

  // Status color helper
  const statusColor = (status) => {
    if (status === 'CREATED') return '#f59e0b';
    if (status === 'STARTED') return '#10b981';
    return '#ef4444';
  };

  return (
    <div className="home-page">
      <div className="hero">
        <h1 className="hero-title">⚡Thinktap</h1>
        <p className="hero-subtitle">Tap Into Your Brainpower.</p>
      </div>

      <div className="cards-row">
        {/* Create Quiz Card */}
        <div className="card">
          <div className="card-icon">🎯</div>
          <h2>Host a Quiz</h2>
          <p>Create a new quiz, add questions, and invite players to join.</p>
          <form onSubmit={handleCreateQuiz}>
            <input
              type="text"
              placeholder="Enter quiz title..."
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="input"
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Quiz →'}
            </button>
          </form>
        </div>

        {/* Join Quiz Card */}
        <div className="card">
          <div className="card-icon">🎮</div>
          <h2>Join a Quiz</h2>
          <p>Enter the Quiz ID shared by your host and start playing.</p>
          <form onSubmit={handleJoinQuiz}>
            <input
              type="number"
              placeholder="Enter Quiz ID..."
              value={joinQuizId}
              onChange={(e) => setJoinQuizId(e.target.value)}
              className="input"
              required
            />
            <button type="submit" className="btn btn-secondary">
              Join Quiz →
            </button>
          </form>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* ── SAVED QUIZZES — HOST SIDE ONLY ── */}
      <div className="saved-quizzes">
        <h2>📋 Your Saved Quizzes</h2>
        {loadingQuizzes ? (
          <p className="empty-state">Loading quizzes...</p>
        ) : savedQuizzes.length === 0 ? (
          <p className="empty-state">No quizzes yet. Create one above!</p>
        ) : (
          <div className="quiz-list">
            {savedQuizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-list-item">
                {/* Left side — title and ID */}
                <div className="quiz-list-info">
                  <strong className="quiz-list-title">{quiz.title}</strong>
                  <span className="quiz-list-id">Quiz ID: #{quiz.id}</span>
                </div>

                {/* Right side — status badge + open button */}
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default HomePage;