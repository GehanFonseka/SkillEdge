import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import './Templates.css';
import '../PostManagement/AddNewPost.css'; // Import AddNewPost styles
import NavBar from '../../components/NavBar/NavBar';
import { FaVideo, FaImage } from "react-icons/fa";
import { HiCalendarDateRange } from "react-icons/hi2";

function AddLearningPlan() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContentURLInput, setShowContentURLInput] = useState(false);
  const [showImageUploadInput, setShowImageUploadInput] = useState(false);
  const [templateID, setTemplateID] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (startDate === endDate) {
      alert("Start date and end date cannot be the same.");
      setIsSubmitting(false);
      return;
    }

    if (startDate > endDate) {
      alert("Start date cannot be greater than end date.");
      setIsSubmitting(false);
      return;
    }

    const postOwnerID = localStorage.getItem('userID');
    const postOwnerName = localStorage.getItem('userFullName');

    if (!postOwnerID) {
      alert('Please log in to add a post.');
      navigate('/');
      return;
    }

    if (tags.length < 2) {
      alert("Please add at least two tags.");
      setIsSubmitting(false);
      return;
    }

    if (!templateID) {
      alert("Please select a template.");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        const uploadResponse = await axios.post('http://localhost:8080/learningPlan/planUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data;
      }

      // Create the new post object
      const newPost = {
        title,
        description,
        contentURL,
        tags,
        postOwnerID,
        postOwnerName,
        imageUrl,
        templateID,
        startDate, 
        endDate,   
        category   
      };

      // Submit the post data
      await axios.post('http://localhost:8080/learningPlan', newPost);
      alert('Post added successfully!');
      navigate('/allLearningPlan');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post.');
    } finally {
      setIsSubmitting(false);
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
      return url; // Return the original URL if it's not a YouTube link
    } catch (error) {
      console.error('Invalid URL:', url);
      return ''; // Return an empty string for invalid URLs
    }
  };

  return (
    <div className="create-post-page">
      <div className="page-header">
        <h1>Create Learning Plan</h1>
        <p style={{ fontSize: '20px' }}>Share your learning journey with others</p>
      </div>
  
      <NavBar />
  
      <div className="create-post-main templates-layout">
        <div className="templates-sidebar">
          <h2 className="template-gallery-title">Choose a Template</h2>
          <div className="templates-list">
            {/* Template 1 */}
            <div 
              className={`template-item ${templateID === '1' ? 'template-selected' : ''}`}
              onClick={() => setTemplateID('1')}
            >
              <div className="template-header">
                <span className="template-badge">Template 1</span>
                {templateID === '1' && <span className="template-selected-badge">Selected</span>}
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
                <div className="preview-media">
                  {imagePreview && (
                    <div className="media-preview-item">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                  {contentURL && (
                    <div className="media-preview-item">
                      <iframe
                        src={getEmbedURL(contentURL)}
                        title="Content Preview"
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
  
            {/* Template 2 */}
            <div 
              className={`template-item ${templateID === '2' ? 'template-selected' : ''}`}
              onClick={() => setTemplateID('2')}
            >
              <div className="template-header">
                <span className="template-badge">Template 2</span>
                {templateID === '2' && <span className="template-selected-badge">Selected</span>}
              </div>
              <div className="template-content">
                <div className="preview-media-grid">
                  {imagePreview && (
                    <div className="media-preview-item">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                  {contentURL && (
                    <div className="media-preview-item">
                      <iframe
                        src={getEmbedURL(contentURL)}
                        title="Content Preview"
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
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
  
            {/* Template 3 */}
            <div 
              className={`template-item ${templateID === '3' ? 'template-selected' : ''}`}
              onClick={() => setTemplateID('3')}
            >
              <div className="template-header">
                <span className="template-badge">Template 3</span>
                {templateID === '3' && <span className="template-selected-badge">Selected</span>}
              </div>
              <div className="template-content">
                <div className={`preview-hero ${imagePreview ? 'has-image' : ''}`}>
                  {imagePreview && <img src={imagePreview} alt="Preview" />}
                  {contentURL && (
                    <iframe
                      src={getEmbedURL(contentURL)}
                      title="Content Preview"
                      frameBorder="0"
                      allowFullScreen
                    />
                  )}
                  <div className="preview-overlay">
                    <h3 className="preview-title">{title || "Title Preview"}</h3>
                    <div className="preview-meta">
                      <span className="preview-dates">
                        <HiCalendarDateRange />
                        <span>{startDate || "Start"} to {endDate || "End"}</span>
                      </span>
                      <span className="preview-category">{category || "Category"}</span>
                    </div>
                  </div>
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
  
        {/* Right Section: Form */}
        <div className="create-post-container">
          
  
          <form onSubmit={handleSubmit} className="create-post-form">
            {/* Form Inputs */}
            <div className="form-floating-group">
              <div className="floating-input">
              <label htmlFor="title">Plan Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder=" "
                />
                
              </div>
  
              <div className="floating-input">
              <label htmlFor="description">Plan Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder=" "
                  rows={6}
                />
                
              </div>
  
              <div className="floating-input">
              <label htmlFor="category">Select Category</label>
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
                
              </div>
  
              <div className="floating-input">
              <label htmlFor="template">Select Template</label>
                <select
                  id="template"
                  value={templateID}
                  onChange={(e) => setTemplateID(e.target.value)}
                  required
                >
                  <option value=""></option>
                  <option value="1">Template 1</option>
                  <option value="2">Template 2</option>
                  <option value="3">Template 3</option>
                </select>
                
              </div>
  
              <div className="date-inputs">
                <div className="floating-input">
                <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  
                </div>
  
                <div className="floating-input">
                <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                  
                </div>
              </div>
            </div>
  
            {/* Tag Section */}
<div className="tags-section material-card"style={{ backgroundColor: '#1e293b', border: '2px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}>
  <div className="tags-header">
  <h3 style={{ color: 'white' }}>Add Tags</h3>
    <span style={{ color: 'white' }}className="tags-subtitle">Help others find your learning plan</span>
  </div>
  <div className="tags-container">
    {tags.map((tag, index) => (
      <span key={index} className="material-tag">
        #{tag}
        <button 
          type="button" 
          onClick={() => setTags(tags.filter((_, i) => i !== index))}
          className="material-remove-tag"
          aria-label="Remove tag"
        >
        
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
  style={{ backgroundColor: '#1e293b', color: 'white', border: '2px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
/>
    <button type="button" onClick={handleAddTag} className="material-add-btn">
      <IoMdAdd className="material-icon" />
    </button>
  </div>
</div>

  
            {/* Media Section */}
            <div className="media-section material-card">
              <div className="media-header">
              
                <h3 style={{ color: 'white' }}>Add Media</h3>
                <span style={{ color: 'white' }}className="media-subtitle">Enhance your learning plan with media</span>
              </div>
              <div className="material-media-buttons">
                <button 
                  type="button" 
                  className={`material-media-btn ${showContentURLInput ? 'active' : ''}`}
                  onClick={() => setShowContentURLInput(!showContentURLInput)}
                  style={{ backgroundColor: '#1e293b', color: 'white', border: '2px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
                >
                  <FaVideo className="material-icon" />
                  <span>Add Video URL</span>
                </button>
                <button 
                  type="button" 
                  className={`material-media-btn ${showImageUploadInput ? 'active' : ''}`}
                  onClick={() => setShowImageUploadInput(!showImageUploadInput)}
                  style={{ backgroundColor: '#1e293b', color: 'white', border: '2px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
                >
                  <FaImage className="material-icon" />
                  <span>Add Image</span>
                </button>
              </div>
  
              {showContentURLInput && (
                <div className="material-url-input">
                  <input
                    type="url"
                    id="contentURL"
                    value={contentURL}
                    onChange={(e) => setContentURL(e.target.value)}
                    placeholder="Paste your YouTube or video URL here"
                    className="material-input"
                  />
                  {contentURL && (
                    <div className="material-url-preview">
                      <iframe
                        src={getEmbedURL(contentURL)}
                        title="Content Preview"
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                  )}
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
                            className="material-change-image"
                            onClick={() => {
                              setImage(null);
                              setImagePreview(null);
                            }}
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
  
            <button type="submit" className="publish-button" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish Learning Plan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
}

export default AddLearningPlan;// Update 0 - 2025-04-02 - Enhanced learning plan functionality
// Update 0 - 2025-04-07 - Enhanced learning plan functionality
// Update 0 - 2025-03-31 - Enhanced learning plan functionality
// Update 3 - 2025-04-05 - Enhanced learning plan functionality
