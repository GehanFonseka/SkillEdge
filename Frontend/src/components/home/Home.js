import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h2>Learn, Share, and Grow Together</h2>
        <p>Join our community to learn new skills and share your expertise.</p>
        <Link to="/register" className="cta-btn">Get Started</Link>
      </div>
    </section>
  );
}

export default Home;
