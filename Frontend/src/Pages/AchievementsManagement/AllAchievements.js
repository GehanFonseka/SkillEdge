import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import NavBar from '../../components/NavBar/NavBar';
import { IoIosCreate } from "react-icons/io";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Paper,
  InputAdornment,
  styled
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Custom styled components
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

const AchievementsContainer = styled(Box)(({ theme }) => ({
  padding: '20px',
  flex: 1,
  maxWidth: '800px',
  margin: '60px auto 0',
}));

const AchievementCard = styled(Card)(({ theme }) => ({
  marginBottom: '20px',
  borderRadius: 15,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
  },
  '& .action_btn_icon_post .action_btn_icon:first-child': {
    background: '#047857',
    color: 'white',
    borderRadius: '5px',
    padding: '5px'
  },
  '& .action_btn_icon_post .action_btn_icon:last-child': {
    color: '#ff4444',
    padding: '5px'
  }
}));

function AllAchievements() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/achievements')
      .then((response) => response.json())
      .then((data) => {
        setProgressData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error('Error fetching Achievements data:', error));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = progressData.filter(
      (achievement) =>
        achievement.title.toLowerCase().includes(query) ||
        achievement.description.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Achievements?')) {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Achievements deleted successfully!');
          setFilteredData(filteredData.filter((progress) => progress.id !== id));
        } else {
          alert('Failed to delete Achievements.');
        }
      } catch (error) {
        console.error('Error deleting Achievements:', error);
      }
    }
  };

  return (
    <Box>
      <NavBar />
      <Box sx={{ 
        display: 'flex', 
        bgcolor: '#ffffff',
        minHeight: 'calc(100vh - 64px)'
      }}>
        {/* Left side - Search */}
        <Box sx={{ width: '400px', flexShrink: 0, mt: -9 }}>
        <StyledSearchBar elevation={0} sx={{ bgcolor: '#0F172A', color: '#ffffff' }}> {/* Updated background and text color */}
<Typography variant="h6" sx={{ mb: 2, color: '#10b981' }}> {/* Updated text color */}Search Achievements</Typography>
            <TextField
              fullWidth
              placeholder="Search by title or description"
              value={searchQuery}
              onChange={handleSearch}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#10b981'}} />
                  </InputAdornment>
                ),
                style: { color: '#ffffff' } // Updated input text color
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#10b981', // Updated border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#047857', // Updated hover border color
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#10b981', // Updated focus border color
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#ffffff', // Updated input text color
                },
                '& .MuiInputLabel-root': {
                  color: '#ffffff', // Updated placeholder text color
                },
              }}
            />
          </StyledSearchBar>
        </Box>

        {/* Right side - Achievements */}
        <AchievementsContainer>
          {filteredData.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>No achievements found</Typography>
              <button className='not_found_btn' onClick={() => window.location.href = '/addAchievements'}>
                Create New Achievement
              </button>
            </Paper>
          ) : (
            filteredData.map((progress) => (
              <AchievementCard key={progress.id}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {progress.postOwnerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {progress.date}
                      </Typography>
                    </Box>
                    {progress.postOwnerID === userId && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <div className='action_btn_icon_post'>
                          <FaEdit
                            onClick={() => window.location.href = `/updateAchievements/${progress.id}`} 
                            className='action_btn_icon' 
                          />
                          <RiDeleteBin6Fill
                            onClick={() => handleDelete(progress.id)}
                            className='action_btn_icon'
                          />
                        </div>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {progress.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: "pre-line",
                      color: 'text.secondary',
                      mb: 2
                    }}
                  >
                    {progress.description}
                  </Typography>

                  {progress.imageUrl && (
                    <Box sx={{ 
                      mt: 2, 
                      borderRadius: 2, 
                      overflow: 'hidden',
                      '& img': {
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }
                    }}>
                      <img
                        src={`http://localhost:8080/achievements/images/${progress.imageUrl}`}
                        alt="Achievement"
                      />
                    </Box>
                  )}
                </CardContent>
              </AchievementCard>
            ))
          )}
        </AchievementsContainer>

        {/* Add button */}
        <div className='add_new_btn' onClick={() => window.location.href = '/addAchievements'}>
          <IoIosCreate className='add_new_btn_icon' />
        </div>
      </Box>
    </Box>
  );
}

export default AllAchievements;
