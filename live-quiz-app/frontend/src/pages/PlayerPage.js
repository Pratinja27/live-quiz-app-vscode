import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinQuiz, getQuiz } from '../services/api';

/**
 * PlayerPage - Allows a player to enter their name and join a quiz.
 * After joining, they are redirected to the QuizScreen with their player ID.
 */
function PlayerPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Verify quiz exists and is joinable
      const quizRes = await getQuiz(quizId);
      const quiz = quizRes.data.data;

      if (quiz.status === 'FINISHED') {
        setError('This quiz has already ended.');
        setLoading(false);
        return;
      }

      // Join the quiz
      const joinRes = await joinQuiz(name.trim(), Number(quizId));
      const player = joinRes.data.data;

      // Redirect to quiz screen with player ID stored in state
      navigate(`/quiz/${quizId}/play`, {
        state: { playerId: player.id, playerName: player.name, quizTitle: quiz.title },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join quiz. Check the Quiz ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <div className="join-card">
        <div className="join-icon">🎮</div>
        <h1>Join Quiz <span className="quiz-id-highlight">#{quizId}</span></h1>
        <p>Enter your name to join and start playing!</p>
        <form onSubmit={handleJoin}>
          <input
            type="text"
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-large"
            maxLength={30}
            required
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? 'Joining...' : 'Join & Play! 🚀'}
          </button>
        </form>
        {error && <div className="error-banner">{error}</div>}
      </div>
    </div>
  );
}

export default PlayerPage;
