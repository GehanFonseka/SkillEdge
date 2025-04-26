import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import './AddNewPost.css';

function AddNewPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [categories, setCategories] = useState('');
  const userID = localStorage.getItem('userID');

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024;

    let imageCount = 0;
    let videoCount = 0;
    const previews = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        window.location.reload();
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
      } else if (file.type === 'video/mp4') {
        videoCount++;

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
            window.location.reload();
          }
        };
      } else {
        alert(`Unsupported file type: ${file.type}`);
        window.location.reload();
      }

      previews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    if (imageCount > 3) {
      alert('You can upload a maximum of 3 images.');
      window.location.reload();
    }

    if (videoCount > 1) {
      alert('You can upload only 1 video.');
      window.location.reload();
    }

    setMedia(files);
    setMediaPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', categories);
    media.forEach((file, index) => formData.append(`mediaFiles`, file));

    try {
      const response = await axios.post('http://localhost:8080/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post created successfully!');
      window.location.href = '/myAllPost';
    } catch (error) {
      console.error(error);
      alert('Failed to create post.');
      window.location.reload();
    }
  };

  return (
    <div className="create-post-page">
      <NavBar />
      <div className="create-post-main">
        <div className="create-post-container">
          <div className="create-post-header">
            <div className="header-content">
              <h1>Create Your Story</h1>
              <p>Share your ideas with the world</p>
            </div>
            <div className="header-decoration"></div>
          </div>

          <form onSubmit={handleSubmit} className="create-post-form">
            <div className="form-floating-group">
              <div className="floating-input">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder=" "
                />
                <label htmlFor="title">Post Title</label>
              </div>

              <div className="floating-input">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder=" "
                  rows={6}
                />
                <label htmlFor="description">Write your story...</label>
              </div>

              <div className="floating-input">
                <select
                  id="category"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
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
            </div>

            <div className="media-section">
              <input
                type="file"
                id="media-upload"
                accept="image/jpeg,image/png,image/jpg,video/mp4"
                multiple
                onChange={handleMediaChange}
                hidden
              />
              <label htmlFor="media-upload" className="media-drop-zone">
                <div className="drop-zone-content">
                  <div className="upload-circle">
                    <span>+</span>
                  </div>
                  <h3>Add Media Files</h3>
                  <p>Drag & drop or click to upload</p>
                  <small>Max: 3 images or 1 video (30s)</small>
                </div>
              </label>

              {mediaPreviews.length > 0 && (
                <div className="media-preview-section">
                  <h3>Media Preview</h3>
                  <div className="preview-grid">
                    {mediaPreviews.map((preview, index) => (
                      <div key={index} className="preview-item">
                        <div className="preview-content">
                          {preview.type.startsWith('video/') ? (
                            <video controls>
                              <source src={preview.url} type={preview.type} />
                            </video>
                          ) : (
                            <img src={preview.url} alt={`Preview ${index}`} />
                          )}
                        </div>
                        <button
                          type="button"
                          className="remove-preview"
                          onClick={() => {
                            const newMedia = [...media];
                            newMedia.splice(index, 1);
                            setMedia(newMedia);
                            const newPreviews = [...mediaPreviews];
                            newPreviews.splice(index, 1);
                            setMediaPreviews(newPreviews);
                          }}
                        >
                          <span>×</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="publish-button">
              Publish Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewPost;
