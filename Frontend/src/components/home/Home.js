import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import heroImage from '../../assets/hero.webp';
import learnImage from '../../assets/learn.png';
import shareImage from '../../assets/skill.png';
import communityImage from '../../assets/community.png';

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Unlock Your Potential: Learn, Share & Grow!</h1>
            <p className="hero-subtitle">
              Join a global community where knowledge meets passion. Discover new skills, share your expertise, and achieve your learning goals.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="cta-btn-primary">Get Started</Link>
              <Link to="/login" className="cta-btn-secondary">Log In</Link>
            </div>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Learning and Sharing" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Join Our Platform?</h2>
        <div className="features-grid">
          <div className="feature">
            <img src={learnImage} alt="Learn New Skills" />
            <h3>Learn New Skills</h3>
            <p>Access a variety of courses, tutorials, and resources to enhance your skills in different domains.</p>
          </div>
          <div className="feature">
            <img src={shareImage} alt="Share Knowledge" />
            <h3>Share Knowledge</h3>
            <p>Become a mentor, create courses, or write articles to contribute to the learning community.</p>
          </div>
          <div className="feature">
            <img src={communityImage} alt="Engage with Community" />
            <h3>Engage with the Community</h3>
            <p>Connect with like-minded learners, collaborate on projects, and participate in discussions.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonial-container">
          <div className="testimonial-box">
            <p>"This platform transformed the way I learn. The community is amazing, and the resources are top-notch!"</p>
            <span>- Alex Johnson, Web Developer</span>
          </div>
          <div className="testimonial-box">
            <p>"I love sharing my knowledge here! Teaching others has helped me grow even more."</p>
            <span>- Maria Lopez, AI Researcher</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Start Your Learning Journey?</h2>
        <p>Sign up now and take the first step towards mastering new skills.</p>
        <Link to="/register" className="cta-btn-primary">Join Now</Link>
      </section>
    </div>
  );
}

export default Home;
