import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getQuiz, getRandomQuestion, submitAnswer } from '../services/api';

const TIMER_SECONDS = 15;

/**
 * QuizScreen - The main gameplay screen for players.
 *
 * Features:
 * - Polls quiz status every 3 seconds (waits for host to start)
 * - Shows questions one at a time with a countdown timer
 * - Submits answer and shows correct/wrong feedback
 * - Advances to leaderboard when quiz finishes
 * - 15-second timer per question
 */
function QuizScreen() {
  const { quizId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { playerId, playerName, quizTitle } = state || {};

  const [quizStatus, setQuizStatus] = useState('CREATED');
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [result, setResult] = useState(null); // answer feedback
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [answered, setAnswered] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  // Redirect if no player state (direct URL access)
  useEffect(() => {
    if (!playerId) navigate(`/player/${quizId}`);
  }, [playerId, quizId, navigate]);

  // Poll quiz status — when STARTED, load first question
  const pollQuizStatus = useCallback(async () => {
    try {
      const res = await getQuiz(quizId);
      const status = res.data.data.status;
      setQuizStatus(status);
      if (status === 'FINISHED') {
        navigate(`/leaderboard/${quizId}`);
      }
    } catch (err) {
      console.error('Error polling quiz status', err);
    }
  }, [quizId, navigate]);

  useEffect(() => {
    const interval = setInterval(pollQuizStatus, 3000);
    return () => clearInterval(interval);
  }, [pollQuizStatus]);

  // Load a new random question
  const loadNextQuestion = useCallback(async () => {
    setQuestionLoading(true);
    setResult(null);
    setSelectedOption('');
    setAnswered(false);
    setTimeLeft(TIMER_SECONDS);
    try {
      const res = await getRandomQuestion(quizId);
      setQuestion(res.data.data);
    } catch (err) {
      setError('Could not load question. Quiz may have ended.');
    } finally {
      setQuestionLoading(false);
    }
  }, [quizId]);

  // Load first question when quiz starts
  useEffect(() => {
    if (quizStatus === 'STARTED' && !question && !questionLoading) {
      loadNextQuestion();
    }
  }, [quizStatus, question, questionLoading, loadNextQuestion]);

  // Countdown timer
  useEffect(() => {
    if (quizStatus !== 'STARTED' || answered || !question) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (!answered) handleTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [question, answered, quizStatus]);

  const handleTimeUp = () => {
    setAnswered(true);
    setResult({ correct: false, message: "Time's up! Moving to next question..." });
    setTimeout(loadNextQuestion, 2500);
  };

  const handleSubmit = async () => {
    if (!selectedOption || answered) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    try {
      const res = await submitAnswer(playerId, question.id, selectedOption);
      const data = res.data.data;
      setResult(data);
      setScore(data.updatedScore);
      // Auto-advance to next question after 3 seconds
      setTimeout(loadNextQuestion, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
    }
  };

  const timerPercent = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 8 ? '#10b981' : timeLeft > 4 ? '#f59e0b' : '#ef4444';

  if (!playerId) return null;

  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <span className="player-name-tag">👤 {playerName}</span>
        <span className="quiz-title-tag">📝 {quizTitle}</span>
        <span className="score-tag">⭐ Score: {score}</span>
      </div>

      {quizStatus === 'CREATED' && (
        <div className="waiting-screen">
          <div className="pulse-circle">⏳</div>
          <h2>Waiting for host to start...</h2>
          <p>Get ready! The quiz will begin soon.</p>
        </div>
      )}

      {quizStatus === 'STARTED' && (
        <>
          {questionLoading && <div className="loading">Loading question...</div>}

          {question && !questionLoading && (
            <div className="question-card">
              {/* Timer Bar */}
              <div className="timer-bar-container">
                <div
                  className="timer-bar"
                  style={{ width: `${timerPercent}%`, background: timerColor, transition: 'width 1s linear, background 0.5s' }}
                />
              </div>
              <div className="timer-display" style={{ color: timerColor }}>
                ⏱ {timeLeft}s
              </div>

              <h2 className="question-text">{question.questionText}</h2>

              <div className="options-grid-play">
                {['A', 'B', 'C', 'D'].map((opt) => {
                  const optionText = question[`option${opt}`];
                  let optClass = 'option-btn';
                  if (answered && result) {
                    if (opt === result.correctAnswer) optClass += ' correct';
                    else if (opt === selectedOption && !result.correct) optClass += ' wrong';
                  } else if (selectedOption === opt) {
                    optClass += ' selected';
                  }
                  return (
                    <button
                      key={opt}
                      className={optClass}
                      onClick={() => !answered && setSelectedOption(opt)}
                      disabled={answered}
                    >
                      <span className="opt-letter">{opt}</span>
                      {optionText}
                    </button>
                  );
                })}
              </div>

              {!answered && (
                <button
                  className="btn btn-primary btn-submit"
                  onClick={handleSubmit}
                  disabled={!selectedOption}
                >
                  Submit Answer
                </button>
              )}

              {result && (
                <div className={`result-banner ${result.correct ? 'result-correct' : 'result-wrong'}`}>
                  {result.correct ? '🎉 ' : '❌ '}{result.message}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {error && <div className="error-banner">{error}</div>}
    </div>
  );
}

export default QuizScreen;
