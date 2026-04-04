import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HostLoginPage from './pages/HostLoginPage';
import HostHomePage from './pages/HostHomePage';
import HostDashboard from './pages/HostDashboard';
import JoinPage from './pages/JoinPage';
import PlayerPage from './pages/PlayerPage';
import QuizScreen from './pages/QuizScreen';
import LeaderboardPage from './pages/LeaderboardPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Home — role selector */}
            <Route path="/" element={<HomePage />} />

            {/* Host flow */}
            <Route path="/host-login" element={<HostLoginPage />} />
            <Route path="/host-home" element={<HostHomePage />} />
            <Route path="/host/:quizId" element={<HostDashboard />} />

            {/* Player flow */}
            <Route path="/join" element={<JoinPage />} />
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