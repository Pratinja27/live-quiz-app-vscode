import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeaderboard, getQuiz } from '../services/api';

/**
 * LeaderboardPage - Shows final rankings after quiz ends.
 * Top 3 players get medal icons. All players shown in ranked order.
 */
function LeaderboardPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lbRes, quizRes] = await Promise.all([
          getLeaderboard(quizId),
          getQuiz(quizId),
        ]);
        setLeaderboard(lbRes.data.data || []);
        setQuizTitle(quizRes.data.data?.title || '');
      } catch (err) {
        console.error('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [quizId]);

  const medals = ['🥇', '🥈', '🥉'];

  if (loading) return <div className="loading">Loading leaderboard...</div>;

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>🏆 Final Leaderboard</h1>
        <p className="quiz-subtitle">{quizTitle}</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="empty-state">No players participated.</div>
      ) : (
        <>
          {/* Podium for top 3 */}
          {leaderboard.length >= 1 && (
            <div className="podium">
              {leaderboard.slice(0, 3).map((entry, idx) => (
                <div key={entry.playerId} className={`podium-spot podium-${idx + 1}`}>
                  <div className="podium-medal">{medals[idx]}</div>
                  <div className="podium-name">{entry.playerName}</div>
                  <div className="podium-score">{entry.score} pts</div>
                  <div className={`podium-block block-${idx + 1}`}>{idx + 1}</div>
                </div>
              ))}
            </div>
          )}

          {/* Full rankings table */}
          <div className="rankings-table">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.playerId} className={entry.rank <= 3 ? 'top-row' : ''}>
                    <td>{medals[entry.rank - 1] || `#${entry.rank}`}</td>
                    <td>{entry.playerName}</td>
                    <td><strong>{entry.score}</strong> pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <button className="btn btn-primary" onClick={() => navigate('/')}>
        🏠 Back to Home
      </button>
    </div>
  );
}

export default LeaderboardPage;
