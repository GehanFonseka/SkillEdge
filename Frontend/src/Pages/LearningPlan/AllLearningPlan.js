import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './post.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import NavBar from '../../Components/NavBar/NavBar';
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

function AllLearningPlan() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchOwnerName, setSearchOwnerName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const userId = localStorage.getItem('userID');

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
