import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import './AddNewPost.css';

function UpdatePost() {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const [existingMedia, setExistingMedia] = useState([]); // Initialize as an empty array
  const [newMedia, setNewMedia] = useState([]); // New media files to upload
  const [loading, setLoading] = useState(true); // Add loading state
  const [mediaPreviews, setMediaPreviews] = useState([]);

  useEffect(() => {
    // Fetch the post details
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${id}`);
        const post = response.data;
        setTitle(post.title || ''); // Ensure title is not undefined
        setDescription(post.description || ''); // Ensure description is not undefined
        setCategory(post.category || ''); // Set category
        setExistingMedia(post.media || []); // Ensure media is an array
        // Create preview URLs for existing media
        const previews = (post.media || []).map(mediaUrl => ({
          type: mediaUrl.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
          url: `http://localhost:8080${mediaUrl}`,
          existing: true,
          path: mediaUrl
        }));
        setMediaPreviews(previews);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Failed to fetch post details.');
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchPost();
  }, [id]);

  const handleDeleteMedia = async (mediaUrl) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this media file?');
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${id}/media`, {
        data: { mediaUrl },
      });
      setExistingMedia(existingMedia.filter((url) => url !== mediaUrl)); // Remove from UI
      alert('Media file deleted successfully!');
    } catch (error) {
      console.error('Error deleting media file:', error);
      alert('Failed to delete media file.');
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
        } else {
          resolve();
        }
      };

      video.onerror = () => {
        reject(`Failed to load video metadata for ${file.name}.`);
      };
    });
  };

  const handleNewMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const maxImageCount = 3;

    let imageCount = existingMedia.filter((url) => !url.endsWith('.mp4')).length;
    let videoCount = existingMedia.filter((url) => url.endsWith('.mp4')).length;

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return;
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
        if (imageCount > maxImageCount) {
          alert('You can upload a maximum of 3 images.');
          return;
        }
      } else if (file.type === 'video/mp4') {
        videoCount++;
        if (videoCount > 1) {
          alert('You can upload only 1 video.');
          return;
        }

        try {
          await validateVideoDuration(file);
        } catch (error) {
          alert(error);
          return;
        }
      } else {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }
    }

    const previews = files.map(file => ({
      type: file.type,
      url: URL.createObjectURL(file),
      existing: false
    }));
    setNewMedia(files);
    setMediaPreviews(prev => [...prev, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category); // Include category in the update
    newMedia.forEach((file) => formData.append('newMediaFiles', file));

    try {
      await axios.put(`http://localhost:8080/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post updated successfully!');
      navigate('/allPost');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };

  if (loading) {
    return <div className="create-post-page"><NavBar /><div>Loading...</div></div>;
  }

  return (
    <div className="create-post-page">
      <NavBar />
      <div className="create-post-main">
        <div className="create-post-container">
          <div className="create-post-header">
            <div className="header-content">
              <h1>Update Your Story</h1>
              <p>Refine and improve your shared ideas</p>
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
            </div>

            <div className="media-section">
              <input
                type="file"
                id="media-upload"
                accept="image/jpeg,image/png,image/jpg,video/mp4"
                multiple
                onChange={handleNewMediaChange}
                hidden
              />
              <label htmlFor="media-upload" className="media-drop-zone">
                <div className="drop-zone-content">
                  <div className="upload-circle">
                    <span>+</span>
                  </div>
                  <h3>Update Media Files</h3>
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
                            if (preview.existing) {
                              handleDeleteMedia(preview.path);
                            } else {
                              const newMedia = [...newMedia];
                              newMedia.splice(index, 1);
                              setNewMedia(newMedia);
                            }
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
              Update Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePost;
