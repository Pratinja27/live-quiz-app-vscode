import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * HomePage — Role selector.
 * Host clicks "I'm a Host" → goes to login page.
 * Player clicks "I'm a Player" → goes to join page directly.
 */
function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="hero">
        <h1 className="hero-title">⚡ ThinkTap</h1>
        <p className="hero-subtitle">
          Tap Into Your Brainpower   !     </p>
      </div>

      <div className="role-selector">
        {/* HOST CARD */}
        <div className="role-card role-host" onClick={() => navigate('/host-login')}>
          <div className="role-icon">🎯</div>
          <h2>I'm a Host</h2>
          <p>Create and manage quizzes, add questions, start games.</p>
          <span className="role-btn">Enter Host Area →</span>
        </div>

        {/* PLAYER CARD */}
        <div className="role-card role-player" onClick={() => navigate('/join')}>
          <div className="role-icon">🎮</div>
          <h2>I'm a Player</h2>
          <p>Enter a Quiz ID from your host and start playing instantly.</p>
          <span className="role-btn">Join a Quiz →</span>
        </div>
      </div>
    </div>
  );
}

export default HomePage;