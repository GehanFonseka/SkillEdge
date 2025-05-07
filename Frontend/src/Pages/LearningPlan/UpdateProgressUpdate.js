import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../components/NavBar/NavBar';
import './ProgressUpdate.css';

const updateTemplates = {
  TUTORIAL_COMPLETED: {
    title: "Tutorial Completed",
    fields: ['content', 'resourcesUsed', 'completionPercentage']
  },
  SKILL_LEARNED: {
    title: "New Skills Learned",
    fields: ['content', 'skillsLearned', 'completionPercentage']
  },
  MILESTONE_REACHED: {
    title: "Milestone Reached",
    fields: ['content', 'completionPercentage']
  }
};

function UpdateProgressUpdate() {
  const { planId, progressId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: '',
    updateType: '',
    completionPercentage: 0,
    skillsLearned: [],
    resourcesUsed: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressUpdate = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/progress-updates/${progressId}`);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching progress update:', error);
        alert('Failed to fetch progress update details');
        setLoading(false);
      }
    };

    fetchProgressUpdate();
  }, [progressId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'skillsLearned' ? value.split(',') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/progress-updates/${progressId}`, {
        ...formData,
        planId,
        userId: localStorage.getItem('userID')
      });
      alert('Progress update modified successfully!');
      navigate('/allLearningPlan');
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="progress-update-page">
      <NavBar />
      <div className="progress-update-container">
        <h1>Update Progress</h1>
        <form onSubmit={handleSubmit} className="progress-update-form">
          <div className="form-group">
            <label>Update Type</label>
            <select 
              name="updateType" 
              value={formData.updateType}
              onChange={handleChange}
              className="form-control"
            >
              {Object.entries(updateTemplates).map(([key, template]) => (
                <option key={key} value={key}>{template.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Describe your progress..."
              rows={4}
            />
          </div>

          {formData.updateType === 'SKILL_LEARNED' && (
            <div className="form-group">
              <label>Skills Learned (comma-separated)</label>
              <input
                type="text"
                name="skillsLearned"
                value={formData.skillsLearned.join(',')}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>
          )}

          {formData.updateType === 'TUTORIAL_COMPLETED' && (
            <div className="form-group">
              <label>Resources Used</label>
              <input
                type="text"
                name="resourcesUsed"
                value={formData.resourcesUsed}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., Udemy Course, YouTube Tutorial"
              />
            </div>
          )}

          <div className="form-group">
            <label>Completion Percentage: {formData.completionPercentage}%</label>
            <input
              type="range"
              name="completionPercentage"
              value={formData.completionPercentage}
              onChange={handleChange}
              min="0"
              max="100"
              className="form-control-range"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              Update Progress
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/allLearningPlan')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProgressUpdate;