import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import './post.css'
import NavBar from '../../Components/NavBar/NavBar';
import { HiCalendarDateRange } from "react-icons/hi2";
import { FaVideo, FaImage } from "react-icons/fa";
import './Templates.css';
import '../PostManagement/AddNewPost.css';

function UpdateLearningPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [templateID, setTemplateID] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [showContentURLInput, setShowContentURLInput] = useState(false);
  const [showImageUploadInput, setShowImageUploadInput] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/learningPlan/${id}`);
        const { title, description, contentURL, tags, imageUrl, templateID, startDate, endDate, category } = response.data;
        setTitle(title);
        setDescription(description);
        setContentURL(contentURL);
        setTags(tags);
        setExistingImage(imageUrl);
        setTemplateID(templateID);
        setStartDate(startDate);
        setEndDate(endDate);
        setCategory(category);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getEmbedURL = (url) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    } catch (error) {
      console.error('Invalid URL:', url);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = existingImage;

    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      try {
        const uploadResponse = await axios.post('http://localhost:8080/learningPlan/planUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
        return;
      }
    }

    const updatedPost = { title, description, contentURL, tags, imageUrl, postOwnerID: localStorage.getItem('userID'), templateID, startDate, endDate, category };
    try {
      await axios.put(`http://localhost:8080/learningPlan/${id}`, updatedPost);
      alert('Post updated successfully!');
      window.location.href = '/allLearningPlan';
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };

  return (
    <div className="create-post-page">
      <NavBar />
      <div className="create-post-main templates-layout">
        <div className="templates-sidebar">
          <h2 className="template-gallery-title">Choose a Template</h2>
          <div className="templates-list">
            <div 
              className={`template-item ${templateID === 1 ? 'template-selected' : ''}`}
              onClick={() => setTemplateID(1)}
            >
              <div className="template-header">
                <span className="template-badge">Template 1</span>
                {templateID === 1 && <span className="template-selected-badge">Selected</span>}
              </div>
              <div className="template-content">
                <h3 className="preview-title">{title || "Title Preview"}</h3>
                <div className="preview-meta">
                  <span className="preview-dates">
                    <HiCalendarDateRange /> 
                    <span>{startDate || "Start"} to {endDate || "End"}</span>
                  </span>
                  <span className="preview-category">{category || "Category"}</span>
                </div>
                <div className="preview-description">{description || "Description Preview"}</div>
                <div className="preview-tags">
                  {tags.map((tag, index) => (
                    <span key={index} className="preview-tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="create-post-container">
          <div className="create-post-header">
            <div className="header-content">
              <h1>Update Learning Plan</h1>
              <p>Modify your learning journey</p>
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
                <label htmlFor="title">Plan Title</label>
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
                <label htmlFor="description">Plan Description</label>
              </div>

              <div className="floating-input">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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

              <div className="date-inputs">
                <div className="floating-input">
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  <label htmlFor="startDate">Start Date</label>
                </div>

                <div className="floating-input">
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                  <label htmlFor="endDate">End Date</label>
                </div>
              </div>
            </div>

            <div className="tags-section material-card">
              <div className="tags-header">
                <h3>Update Tags</h3>
                <span className="tags-subtitle">Help others find your learning plan</span>
              </div>
              <div className="tags-container">
                {tags.map((tag, index) => (
                  <span key={index} className="material-tag">
                    #{tag}
                    <button 
                      type="button" 
                      onClick={() => handleDeleteTag(index)}
                      className="material-remove-tag"
                    >
                      <span className="material-icon">×</span>
                    </button>
                  </span>
                ))}
              </div>
              <div className="material-tag-input">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Type a tag and press Enter"
                  className="material-input"
                />
                <button type="button" onClick={handleAddTag} className="material-add-btn">
                  <IoMdAdd className="material-icon" />
                </button>
              </div>
            </div>

            <div className="media-section material-card">
              <div className="media-header">
                <h3>Update Media</h3>
                <span className="media-subtitle">Enhance your learning plan with media</span>
              </div>
              <div className="material-media-buttons">
                <button 
                  type="button" 
                  className={`material-media-btn ${showContentURLInput ? 'active' : ''}`}
                  onClick={() => setShowContentURLInput(!showContentURLInput)}
                >
                  <FaVideo className="material-icon" />
                  <span>Update Video URL</span>
                </button>
                <button 
                  type="button" 
                  className={`material-media-btn ${showImageUploadInput ? 'active' : ''}`}
                  onClick={() => setShowImageUploadInput(!showImageUploadInput)}
                >
                  <FaImage className="material-icon" />
                  <span>Update Image</span>
                </button>
              </div>

              {showContentURLInput && (
                <div className="material-url-input">
                  <input
                    type="url"
                    value={contentURL}
                    onChange={(e) => setContentURL(e.target.value)}
                    placeholder="Paste your YouTube or video URL here"
                    className="material-input"
                  />
                </div>
              )}

              {showImageUploadInput && (
                <div className="material-upload-section">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                  <label htmlFor="image-upload" className="material-drop-zone">
                    <div className="material-drop-content">
                      {imagePreview ? (
                        <div className="material-preview-container">
                          <img src={imagePreview} alt="Preview" className="material-image-preview" />
                          <button 
                            type="button" 
                            onClick={() => {
                              setImage(null);
                              setImagePreview(null);
                            }}
                            className="material-change-image"
                          >
                            Change Image
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="material-upload-icon">
                            <FaImage />
                          </div>
                          <h3>Drop your image here</h3>
                          <p>or click to browse</p>
                          <span className="material-upload-hint">Supports: JPG, PNG (Max 5MB)</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              )}
            </div>

            <button type="submit" className="publish-button">
              Update Learning Plan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateLearningPost;
