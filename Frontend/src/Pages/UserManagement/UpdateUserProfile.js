import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import NavBar from '../../Components/NavBar/NavBar';
import '../PostManagement/AddNewPost.css';

function UpdateUserProfile() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: '',
    skills: [],
    bio: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  useEffect(() => {
    fetch(`http://localhost:8080/user/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then((data) => setFormData(data))
      .catch((error) => console.error('Error:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        if (profilePicture) {
          const formData = new FormData();
          formData.append('file', profilePicture);
          await fetch(`http://localhost:8080/user/${id}/uploadProfilePicture`, {
            method: 'PUT',
            body: formData,
          });
        }
        alert('Profile updated successfully!');
        window.location.href = '/userProfile';
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="create-post-page">
      <NavBar />
      <div className="create-post-main">
        <div className="create-post-container">
          <div className="create-post-header">
            <div className="header-content">
              <h1>Update Your Profile</h1>
              <p>Refine your personal information</p>
            </div>
            <div className="header-decoration"></div>
          </div>

          <form onSubmit={handleSubmit} className="create-post-form">
            <div className="form-floating-group">
              <div className="floating-input">
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="fullname">Full Name</label>
              </div>

              <div className="floating-input">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="email">Email Address</label>
              </div>

              <div className="floating-input">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="password">Password</label>
              </div>

              <div className="floating-input">
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const re = /^[0-9\b]{0,10}$/;
                    if (re.test(e.target.value)) {
                      handleInputChange(e);
                    }
                  }}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits"
                  required
                  placeholder=" "
                />
                <label htmlFor="phone">Phone Number</label>
              </div>

              <div className="floating-input">
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder=" "
                />
                <label htmlFor="bio">Write your bio...</label>
              </div>

              <div className="tag-section">
                <label className="tag-label">Skills</label>
                <div className="tag-input-wrapper">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type a skill and press Enter"
                    className="tag-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="tag-add-btn"
                  >
                    <IoMdAdd />
                  </button>
                </div>
                <div className="tag-cloud">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="tag">
                      {skill}
                      <button
                        type="button"
                        className="tag-remove-btn"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="media-section">
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  hidden
                />
                <label htmlFor="profile-upload" className="media-drop-zone">
                  <div className="drop-zone-content">
                    <div className="upload-circle">
                      <span>+</span>
                    </div>
                    <h3>Profile Picture</h3>
                    <p>Click to upload</p>
                  </div>
                </label>

                {(previewImage || formData.profilePicturePath) && (
                  <div className="media-preview-section">
                    <h3>Preview</h3>
                    <div className="preview-item">
                      <div className="preview-content">
                        <img
                          src={previewImage || `http://localhost:8080/uploads/profile/${formData.profilePicturePath}`}
                          alt="Profile Preview"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="publish-button">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUserProfile;
