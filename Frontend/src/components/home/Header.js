import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Redirect after logout
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>SkillEdge</h1>
      </div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/HomePage" className="nav-link">Skill Posts</Link>
        <Link to="/learning-plans" className="nav-link">Learning Plans</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <Link to="/notifications" className="nav-link">Notifications</Link>

        {user ? (
          <div className="user-info">
            <span className="nav-user">{user.username}</span>
            <img
              src={user.profilePictureUrl || "/default-avatar.png"}
              alt=""
              className="nav-avatar"
            />
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;