import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Navbar - Top navigation bar shown on all pages.
 */
function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        ⚡ <span>LiveQuiz</span>
      </div>
      <div className="navbar-links">
        <button className="nav-link" onClick={() => navigate('/')}>Home</button>
      </div>
    </nav>
  );
}

export default Navbar;
