import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz } from '../services/api';

/**
 * HomePage - Landing page with two actions:
 * 1. Create a new quiz (host flow)
 * 2. Join an existing quiz (player flow)
 */
function HomePage() {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('');
  const [joinQuizId, setJoinQuizId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await createQuiz(quizTitle);
      const quiz = response.data.data;
      // Navigate to host dashboard with the new quiz ID
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

  return (
    <div className="home-page">
      <div className="hero">
        <h1 className="hero-title">⚡ LiveQuiz</h1>
        <p className="hero-subtitle">Host live quizzes. Play in real time. Win the crown.</p>
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
    </div>
  );
}

export default HomePage;
