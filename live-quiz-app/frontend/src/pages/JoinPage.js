import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * JoinPage — Player enters Quiz ID to join.
 * This is the ONLY page players need.
 */
function JoinPage() {
  const navigate = useNavigate();
  const [quizId, setQuizId] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (!quizId.trim()) return;
    navigate(`/player/${quizId}`);
  };

  return (
    <div className="center-page">
      <div className="join-card">
        <div className="join-icon">🎮</div>
        <h1>Join a Quiz</h1>
        <p>Enter the Quiz ID your host shared with you.</p>
        <form onSubmit={handleJoin}>
          <input
            type="number"
            placeholder="Enter Quiz ID..."
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            className="input input-large"
            required
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-large">
            Join Quiz →
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinPage;