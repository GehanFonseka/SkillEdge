import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import your CSS file for styling

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>SkillEdge</h1>
      </div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/posts" className="nav-link">Skill Posts</Link>
        <Link to="/learning-plans" className="nav-link">Learning Plans</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <Link to="/notifications" className="nav-link">Notifications</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </nav>
    </header>
  );
}

export default Header;