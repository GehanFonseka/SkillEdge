import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig'; // Correct path
import { useNavigate } from 'react-router-dom';
import './profilepage.css';

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: '',
    fullName: '',
    bio: '',
    location: '',
    phoneNumber: '',
    profilePictureUrl: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch profile after login
  useEffect(() => {
    console.log("Token:", localStorage.getItem("token"));

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('/api/v1/auth/profile')
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        setError('Failed to fetch profile: ' + err.response?.data || err.message);
        console.error('Error fetching profile:', err);
      });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    axios
      .put('/api/v1/auth/profile', user)
      .then(() => {
        alert('Profile updated successfully');
      })
      .catch((err) => {
        setError('Failed to update profile: ' + err.response?.data || err.message);
      });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      axios
        .delete('/api/v1/auth/profile')
        .then(() => {
          localStorage.removeItem('token');
          navigate('/login');
        })
        .catch((err) => {
          setError('Failed to delete profile: ' + err.response?.data || err.message);
        });
        
    }
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="profile-container">
      <h2>Profile Page</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <img src={user.profilePictureUrl} alt="Profile" className="profile-picture" />
        </div>
        <div>
          <label>Profile Picture URL:</label>
          <input
            type="text"
            name="profilePictureUrl"
            value={user.profilePictureUrl}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            disabled
          />
        </div>
        <div>
          <label>Bio:</label>
          <textarea name="bio" value={user.bio} onChange={handleChange} />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={user.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>

      <button onClick={handleDelete} className="delete-button">
        Delete Profile
      </button>
    </div>
  );
};

export default ProfilePage;
