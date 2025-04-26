import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './user.css'
import GoogalLogo from './img/glogo.png'

function UserLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userID', data.id); // Save user ID in local storage
        alert('Login successful!');
        navigate('/allPost');
      } else if (response.status === 401) {
        alert('Invalid credentials!');
      } else {
        alert('Failed to login!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-left">
          <div className="auth-overlay">
            <h1>Welcome Back!</h1>
            <p>Connect with your favorite communities</p>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-box">
            <h2>Sign In</h2>
            <p className="auth-subtitle">Please login to continue</p>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" className="auth-button">
                Sign In
              </button>

              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                className="google-button"
              >
                <img src={GoogalLogo} alt='Google' className='google-icon' />
                Google
              </button>

              <p className="auth-footer">
                Don't have an account?{' '}
                <span 
                  onClick={() => (window.location.href = '/register')} 
                  className="auth-link"
                >
                  Sign up
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
