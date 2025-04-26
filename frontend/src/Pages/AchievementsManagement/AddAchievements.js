import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import '../PostManagement/AddNewPost.css';

function AddAchievements() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    postOwnerID: '',
    category: '',
    postOwnerName: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      setFormData((prevData) => ({ ...prevData, postOwnerID: userId }));
      fetch(`http://localhost:8080/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.fullname) {
            setFormData((prevData) => ({ ...prevData, postOwnerName: data.fullname }));
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
        method: 'POST',
        body: formData,
      });
      imageUrl = await uploadResponse.text();
    }

    const response = await fetch('http://localhost:8080/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, imageUrl }),
    });
    if (response.ok) {
      alert('Achievements added successfully!');
      window.location.href = '/myAchievements';
    } else {
      alert('Failed to add Achievements.');
    }
  };

  return (
    <div className="create-post-page">
      <NavBar />
      <div className="create-post-main">
        <div className="create-post-container">
          <div className="create-post-header">
            <div className="header-content">
              <h1>Share Your Achievement</h1>
              <p>Celebrate your milestones with the community</p>
            </div>
            <div className="header-decoration"></div>
          </div>

          <form onSubmit={handleSubmit} className="create-post-form">
            <div className="form-floating-group">
              <div className="floating-input">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="title">Achievement Title</label>
              </div>

              <div className="floating-input">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  rows={6}
                />
                <label htmlFor="description">Tell us about your achievement</label>
              </div>

              <div className="floating-input">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled></option>
                  <option value="Tech">Tech</option>
                  <option value="Programming">Programming</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Photography">Photography</option>
                </select>
                <label htmlFor="category">Select Category</label>
              </div>

              <div className="floating-input">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="date">Achievement Date</label>
              </div>
            </div>

            <div className="media-section">
              <input
                type="file"
                id="media-upload"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
              <label htmlFor="media-upload" className="media-drop-zone">
                <div className="drop-zone-content">
                  <div className="upload-circle">
                    <span>+</span>
                  </div>
                  <h3>Add Achievement Image</h3>
                  <p>Drag & drop or click to upload</p>
                  <small>Upload a photo of your achievement</small>
                </div>
              </label>

              {imagePreview && (
                <div className="media-preview-section">
                  <h3>Image Preview</h3>
                  <div className="preview-grid">
                    <div className="preview-item">
                      <div className="preview-content">
                        <img src={imagePreview} alt="Achievement Preview" />
                      </div>
                      <button
                        type="button"
                        className="remove-preview"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                      >
                        <span>×</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="publish-button">
              Share Achievement
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAchievements;
