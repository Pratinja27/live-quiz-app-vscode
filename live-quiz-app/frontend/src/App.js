import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HostDashboard from './pages/HostDashboard';
import PlayerPage from './pages/PlayerPage';
import QuizScreen from './pages/QuizScreen';
import LeaderboardPage from './pages/LeaderboardPage';
import './App.css';

/**
 * App.js - Root component with React Router configuration.
 *
 * Routes:
 *   /                        -> HomePage (create or join quiz)
 *   /host/:quizId            -> HostDashboard (manage quiz)
 *   /player/:quizId          -> PlayerPage (enter name and join)
 *   /quiz/:quizId/play       -> QuizScreen (answer questions)
 *   /leaderboard/:quizId     -> LeaderboardPage (final rankings)
 */
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/host/:quizId" element={<HostDashboard />} />
            <Route path="/player/:quizId" element={<PlayerPage />} />
            <Route path="/quiz/:quizId/play" element={<QuizScreen />} />
            <Route path="/leaderboard/:quizId" element={<LeaderboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
