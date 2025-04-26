import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import '../PostManagement/AddNewPost.css';

function UpdateAchievements() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    postOwnerID: '',
    postOwnerName: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch achievement');
        }
        const data = await response.json();
        setFormData(data);
        if (data.imageUrl) {
          setPreviewImage(`http://localhost:8080/achievements/images/${data.imageUrl}`);
        }
      } catch (error) {
        console.error('Error fetching Achievements data:', error);
        alert('Error loading achievement data');
      }
    };
    fetchAchievement();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.imageUrl;
      
      // Upload new image if selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        
        const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }
        imageUrl = await uploadResponse.text();
      }

      // Update achievement data
      const updatedData = { ...formData, imageUrl };
      const response = await fetch(`http://localhost:8080/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Achievement updated successfully!');
        window.location.href = '/allAchievements';
      } else {
        throw new Error('Failed to update achievement');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred during update');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <NavBar />
      <div className="create-post-main">
        <div className="create-post-container">
          <div className="create-post-header">
            <div className="header-content">
              <h1>Update Achievement</h1>
              <p>Refine and improve your accomplishment</p>
            </div>
            <div className="header-decoration"></div>
          </div>

          <form onSubmit={handleSubmit} className="create-post-form">
            <div className="form-floating-group">
              <div className="media-section">
                <input
                  type="file"
                  id="media-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
                <label htmlFor="media-upload" className="media-drop-zone">
                  <div className="drop-zone-content">
                    <div className="upload-circle">
                      <span>+</span>
                    </div>
                    <h3>Update Image</h3>
                    <p>Click to upload new image</p>
                  </div>
                </label>

                {(previewImage || formData.imageUrl) && (
                  <div className="media-preview-section">
                    <h3>Image Preview</h3>
                    <div className="preview-grid">
                      <div className="preview-item">
                        <div className="preview-content">
                          <img src={previewImage || `http://localhost:8080/achievements/images/${formData.imageUrl}`} alt="Achievement" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="floating-input">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  required
                  placeholder=" "
                  rows={6}
                />
                <label htmlFor="description">Achievement Description</label>
              </div>

              <div className="floating-input">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="date">Achievement Date</label>
              </div>
            </div>

            <button type="submit" className="publish-button" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Achievement'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateAchievements;