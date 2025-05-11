import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './post.css';
import './ProgressUpdate.css';
import { FaEdit, FaPlus } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import { IoStatsChart } from 'react-icons/io5';
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import NavBar from '../../components/NavBar/NavBar';
import { HiCalendarDateRange } from "react-icons/hi2";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  styled
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

// Styled components
const StyledSearchBar = styled(Paper)(({ theme }) => ({
  padding: '16px',
  width: '100%',
  height: 'calc(100vh - 64px)',
  position: 'sticky',
  top: '64px',
  borderRadius: 0,
  boxShadow: 'none',
  borderRight: '1px solid rgba(0,0,0,0.12)',
  marginTop: '60px'
}));

const PostsContainer = styled(Box)(({ theme }) => ({
  padding: '20px',
  flex: 1,
  maxWidth: '800px',
  margin: '60px auto 0',
}));

const getProgressLevel = (percentage) => {
  if (percentage < 33) return "low";
  if (percentage < 66) return "medium";
  return "high";
};

function AllLearningPlan() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchOwnerName, setSearchOwnerName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [progressUpdates, setProgressUpdates] = useState({});
  const [showProgress, setShowProgress] = useState({});
  const userId = localStorage.getItem('userID');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/learningPlan');
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const applyFilters = (ownerName, category) => {
    const filtered = posts.filter((post) =>
      post.postOwnerName.toLowerCase().includes(ownerName.toLowerCase()) &&
      post.category.toLowerCase().includes(category.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    const fetchProgressUpdates = async (planId) => {
      try {
        const response = await axios.get(`http://localhost:8080/progress-updates/plan/${planId}`);
        setProgressUpdates(prev => ({
          ...prev,
          [planId]: response.data
        }));
      } catch (error) {
        console.error('Error fetching progress updates:', error);
      }
    };

    filteredPosts.forEach(post => fetchProgressUpdates(post.id));
  }, [filteredPosts]);

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/learningPlan/${id}`);
        alert('Post deleted successfully!');
        setFilteredPosts(filteredPosts.filter((post) => post.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  const handleUpdate = (id) => {
    window.location.href = `/updateLearningPlan/${id}`;
  };

  const toggleProgress = (postId) => {
    setShowProgress(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleUpdateProgress = (planId, progressId) => {
    navigate(`/learning-plan/${planId}/update-progress/${progressId}`);
  };

  const handleDeleteProgress = async (planId, progressId) => {
    if (window.confirm('Are you sure you want to delete this progress update?')) {
      try {
        await axios.delete(`http://localhost:8080/progress-updates/${progressId}`);
        // Update the state to remove the deleted progress
        setProgressUpdates(prev => ({
          ...prev,
          [planId]: prev[planId].filter(update => update.id !== progressId)
        }));
        alert('Progress update deleted successfully!');
      } catch (error) {
        console.error('Error deleting progress update:', error);
        alert('Failed to delete progress update.');
      }
    }
  };

  const renderProgressSection = (post) => {
    const updates = progressUpdates[post.id] || [];
    return (
      <div className="progress-section">
        <div className="button-container">
          <button 
            className="add-progress-btn"
            onClick={() => navigate(`/learning-plan/${post.id}/add-progress`)}
          >
            <FaPlus size={16} />
            Add Progress
          </button>
          
          <button 
            className={`show-progress-btn ${showProgress[post.id] ? 'active' : ''}`}
            onClick={() => toggleProgress(post.id)}
          >
            <IoStatsChart size={16} />
            {showProgress[post.id] ? 'Hide Progress' : 'Show Progress'}
          </button>
        </div>
        {showProgress[post.id] && (
          <div className="progress-updates">
            <h4>Learning Progress</h4>
            {updates.length === 0 ? (
              <p>No progress updates yet</p>
            ) : (
              updates.map(update => (
                <div key={update.id} className="progress-update-card">
                  <div className="update-header">
                    <div className="update-header-left">
                      <span className="update-type">{update.updateType}</span>
                      <span className="update-date">{update.date}</span>
                    </div>
                    {update.userId === userId && (
                      <div className="progress-actions">
                        <button
                          className="progress-action-btn"
                          onClick={() => handleUpdateProgress(post.id, update.id)}
                        >
                          <FiEdit className="progress-icon" />
                        </button>
                        <button
                          className="progress-action-btn delete"
                          onClick={() => handleDeleteProgress(post.id, update.id)}
                        >
                          <MdDeleteOutline className="progress-icon" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="update-content">{update.content}</p>
                  <div className="update-details">
                    <div className="completion-bar">
                      <div 
                        className="completion-fill"
                        style={{ width: `${update.completionPercentage}%` }}
                        data-progress={getProgressLevel(update.completionPercentage)}
                      />
                      <span 
                        className="completion-text"
                        data-progress={getProgressLevel(update.completionPercentage)}
                      >
                        {update.completionPercentage}% Complete
                      </span>
                    </div>
                    {update.skillsLearned?.length > 0 && (
                      <div className="skills-learned">
                        <strong>Skills:</strong> {update.skillsLearned.join(', ')}
                      </div>
                    )}
                    {update.resourcesUsed && (
                      <div className="resources-used">
                        <strong>Resources:</strong> {update.resourcesUsed}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPostByTemplate = (post) => {
    switch (post.templateID) {
      case 1:
        return (
          <div className="template_dis template-1">
            <div className='user_details_card'>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name'>{post.postOwnerName}</p>
                </div>
              </div>
              {post.postOwnerID === userId && (
                <div className='action_btn_icon_post'>
                  <FaEdit onClick={() => handleUpdate(post.id)} className='action_btn_icon' />
                  <RiDeleteBin6Fill onClick={() => handleDelete(post.id)} className='action_btn_icon' />
                </div>
              )}
            </div>
            <p className='template_title'>{post.title}</p>
            <p className='template_dates'><HiCalendarDateRange /> {post.startDate} to {post.endDate}</p>
            <p className='template_description'>{post.category}</p>
            <hr />
            <p className='template_description' style={{ whiteSpace: "pre-line" }}>{post.description}</p>
            <div className="tags_preview">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname">#{tag}</span>
              ))}
            </div>
            {post.imageUrl && (
              <img src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`} alt={post.title} className="iframe_preview_dis" />
            )}
            {post.contentURL && (
              <iframe src={getEmbedURL(post.contentURL)} title={post.title} className="iframe_preview_dis" frameBorder="0" allowFullScreen></iframe>
            )}
            {renderProgressSection(post)}
          </div>
        );
      case 2:
        return (
          <div className="template_dis template-2">
            <div className='user_details_card'>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name'>{post.postOwnerName}</p>
                </div>
              </div>
              {post.postOwnerID === userId && (
                <div className='action_btn_icon_post'>
                  <FaEdit onClick={() => handleUpdate(post.id)} className='action_btn_icon' />
                  <RiDeleteBin6Fill onClick={() => handleDelete(post.id)} className='action_btn_icon' />
                </div>
              )}
            </div>
            <p className='template_title'>{post.title}</p>
            <p className='template_dates'><HiCalendarDateRange /> {post.startDate} to {post.endDate}</p>
            <p className='template_description'>{post.category}</p>
            <hr />
            <p className='template_description' style={{ whiteSpace: "pre-line" }}>{post.description}</p>
            <div className="tags_preview">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname">#{tag}</span>
              ))}
            </div>
            <div className='preview_part'>
              <div className='preview_part_sub'>
                {post.imageUrl && (
                  <img src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`} alt={post.title} className="iframe_preview" />
                )}
              </div>
              <div className='preview_part_sub'>
                {post.contentURL && (
                  <iframe src={getEmbedURL(post.contentURL)} title={post.title} className="iframe_preview" frameBorder="0" allowFullScreen></iframe>
                )}
              </div>
            </div>
            {renderProgressSection(post)}
          </div>
        );
      case 3:
        return (
          <div className="template_dis template-3">
            <div className='user_details_card'>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name'>{post.postOwnerName}</p>
                </div>
              </div>
              {post.postOwnerID === userId && (
                <div className='action_btn_icon_post'>
                  <FaEdit onClick={() => handleUpdate(post.id)} className='action_btn_icon' />
                  <RiDeleteBin6Fill onClick={() => handleDelete(post.id)} className='action_btn_icon' />
                </div>
              )}
            </div>
            {post.imageUrl && (
              <img src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`} alt={post.title} className="iframe_preview_dis" />
            )}
            {post.contentURL && (
              <iframe src={getEmbedURL(post.contentURL)} title={post.title} className="iframe_preview_dis" frameBorder="0" allowFullScreen></iframe>
            )}
            <p className='template_title'>{post.title}</p>
            <p className='template_dates'><HiCalendarDateRange /> {post.startDate} to {post.endDate}</p>
            <p className='template_description'>{post.category}</p>
            <hr />
            <p className='template_description' style={{ whiteSpace: "pre-line" }}>{post.description}</p>
            <div className="tags_preview">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname">#{tag}</span>
              ))}
            </div>
            {renderProgressSection(post)}
          </div>
        );
      default:
        return (
          <div className="template template-default">
            <p>Unknown template ID: {post.templateID}</p>
          </div>
        );
    }
  };

  return (
    <Box>
      <NavBar />
      <Box sx={{
        display: 'flex',
        bgcolor: '#ffffff',
        minHeight: 'calc(100vh - 64px)',
        
      }}>
        {/* Left side - Search */}
        <Box sx={{ width: '400px', flexShrink: 0, mt: -5 }}>
  <StyledSearchBar elevation={0} sx={{ bgcolor: '#0F172A', color: '#ffffff' }}>
    <Typography variant="h6" sx={{ mb: 2, color: '#ffffff' }}>
      Search Learning Plans
    </Typography>
    <TextField
      fullWidth
      placeholder="Search by Category"
      value={searchCategory}
      onChange={(e) => {
        const value = e.target.value;
        setSearchCategory(value);
        applyFilters(searchOwnerName, value);
      }}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#ffffff' }} /> {/* White search icon */}
          </InputAdornment>
        ),
        style: { color: '#ffffff' }, // White input text
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#ffffff', // White border
          },
          '&:hover fieldset': {
            borderColor: '#10b981', // Green border on hover
          },
          '&.Mui-focused fieldset': {
            borderColor: '#10b981', // Green border on focus
          },
        },
        '& .MuiInputBase-input': {
          color: '#ffffff', // White input text
        },
        '& .MuiInputLabel-root': {
          color: '#ffffff', // White placeholder text
        },
      }}
    />
  </StyledSearchBar>
</Box>

        {/* Right side - Posts */}
        <PostsContainer>
          {filteredPosts.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>No learning plans found</Typography>
              <button className='not_found_btn' onClick={() => (window.location.href = '/addLearningPlan')}>
                Create New Learning Plan
              </button>
            </Paper>
          ) : (
            filteredPosts.map((post) => (
              <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }} key={post.id}>
                {renderPostByTemplate(post)}
              </Paper>
            ))
          )}
        </PostsContainer>

        {/* Add button */}
        <div className='add_new_btn' onClick={() => (window.location.href = '/addLearningPlan')}>
          <IoIosCreate className='add_new_btn_icon' />
        </div>
      </Box>
    </Box>
  );
}

export default AllLearningPlan;
