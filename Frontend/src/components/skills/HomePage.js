import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
// The CreatePost component from earlier

const HomePage = () => {
  return (
    <div className="home-container">
      <header className="header">
        <h1>Welcome to SkillShare</h1>
        <p>Your platform for sharing and learning new skills!</p>
      </header>

      <div className="nav-container">
        <nav className="nav-links">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create-post">Create Post</Link>
            </li>
            <li>
              <Link to="/posts">View Posts</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="content-container">
        <section className="create-post-section">
          <h2>Create a New Post</h2>
           {/* Include CreatePost component */}
        </section>

        <section className="posts-section">
          <h2>Recent Posts</h2>
       {/* Display all posts */}
        </section>
      </div>

 
    </div>
  );
};

export default HomePage;
