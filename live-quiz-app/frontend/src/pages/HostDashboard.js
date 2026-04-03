import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, addQuestion, getQuestions, startQuiz, endQuiz, getPlayersInQuiz } from '../services/api';

/**
 * HostDashboard - The quiz host's control panel.
 *
 * Features:
 * - View quiz details and current status
 * - Add questions to the quiz
 * - See list of players who joined
 * - Start and end the quiz
 * - Auto-refresh player list every 5 seconds
 */
function HostDashboard() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // New question form state
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
  });

  const fetchData = useCallback(async () => {
    try {
      const [quizRes, playersRes, questionsRes] = await Promise.all([
        getQuiz(quizId),
        getPlayersInQuiz(quizId),
        getQuestions(quizId),
      ]);
      setQuiz(quizRes.data.data);
      setPlayers(playersRes.data.data || []);
      setQuestions(questionsRes.data.data || []);
    } catch (err) {
      setError('Failed to load quiz data');
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchData();
    // Auto-refresh player list every 5 seconds so host can see who joins
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addQuestion(quizId, {
        ...questionForm,
        correctAnswer: questionForm.correctAnswer.toUpperCase(),
      });
      setSuccessMsg('Question added!');
      setQuestionForm({ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' });
      fetchData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question');
    }
  };

  const handleStartQuiz = async () => {
    try {
      await startQuiz(quizId);
      setSuccessMsg('Quiz started! Players can now answer questions.');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start quiz');
    }
  };

  const handleEndQuiz = async () => {
    try {
      await endQuiz(quizId);
      navigate(`/leaderboard/${quizId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to end quiz');
    }
  };

  if (loading) return <div className="loading">Loading quiz...</div>;

  const statusColor = { CREATED: '#f59e0b', STARTED: '#10b981', FINISHED: '#ef4444' };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>🎛️ Host Dashboard</h1>
          <p className="quiz-title-display">{quiz?.title}</p>
          <span className="status-badge" style={{ background: statusColor[quiz?.status] }}>
            {quiz?.status}
          </span>
          <p className="quiz-id-display">Share this Quiz ID with players: <strong>#{quizId}</strong></p>
        </div>
        <div className="host-actions">
          {quiz?.status === 'CREATED' && (
            <button className="btn btn-success" onClick={handleStartQuiz} disabled={questions.length === 0}>
              {questions.length === 0 ? 'Add questions first' : '▶ Start Quiz'}
            </button>
          )}
          {quiz?.status === 'STARTED' && (
            <button className="btn btn-danger" onClick={handleEndQuiz}>
              ⏹ End Quiz & See Results
            </button>
          )}
          {quiz?.status === 'FINISHED' && (
            <button className="btn btn-secondary" onClick={() => navigate(`/leaderboard/${quizId}`)}>
              🏆 View Leaderboard
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {successMsg && <div className="success-banner">{successMsg}</div>}

      <div className="dashboard-grid">
        {/* Players Panel */}
        <div className="panel">
          <h2>👥 Players Joined ({players.length})</h2>
          {players.length === 0 ? (
            <p className="empty-state">No players yet. Share Quiz ID #{quizId}</p>
          ) : (
            <ul className="player-list">
              {players.map((p) => (
                <li key={p.id} className="player-item">
                  <span className="player-name">{p.name}</span>
                  <span className="player-score">Score: {p.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Questions Panel */}
        <div className="panel">
          <h2>❓ Questions ({questions.length})</h2>
          {questions.length === 0 ? (
            <p className="empty-state">No questions yet. Add one below.</p>
          ) : (
            <ul className="question-list">
              {questions.map((q, idx) => (
                <li key={q.id} className="question-item">
                  <strong>Q{idx + 1}:</strong> {q.questionText}
                  <span className="correct-label">✓ {q.correctAnswer}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Add Question Form — only available before quiz starts */}
      {quiz?.status === 'CREATED' && (
        <div className="panel add-question-panel">
          <h2>➕ Add Question</h2>
          <form onSubmit={handleAddQuestion} className="question-form">
            <textarea
              placeholder="Question text..."
              value={questionForm.questionText}
              onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
              className="input textarea"
              required
            />
            <div className="options-grid">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <input
                  key={opt}
                  type="text"
                  placeholder={`Option ${opt}`}
                  value={questionForm[`option${opt}`]}
                  onChange={(e) => setQuestionForm({ ...questionForm, [`option${opt}`]: e.target.value })}
                  className="input"
                  required
                />
              ))}
            </div>
            <div className="correct-answer-row">
              <label>Correct Answer:</label>
              <select
                value={questionForm.correctAnswer}
                onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                className="input select"
              >
                {['A', 'B', 'C', 'D'].map((opt) => (
                  <option key={opt} value={opt}>Option {opt}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Add Question</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default HostDashboard;
