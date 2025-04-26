import React, { useEffect, useState } from 'react';
import { FaUserGraduate } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import axios from 'axios';
import './NavBar.css';
import Pro from './img/img.png';
import { fetchUserDetails } from '../../Pages/UserManagement/UserProfile';

function NavBar() {
    const [allRead, setAllRead] = useState(true);
    const [googleProfileImage, setGoogleProfileImage] = useState(null);
    const [userType, setUserType] = useState(null);
    const [userProfileImage, setUserProfileImage] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [hoveredItem, setHoveredItem] = useState(null);
    const userId = localStorage.getItem('userID');
    let lastScrollY = window.scrollY;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
                const unreadNotifications = response.data.some(notification => !notification.read);
                setAllRead(!unreadNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    useEffect(() => {
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);
        if (storedUserType === 'google') {
            const googleImage = localStorage.getItem('googleProfileImage');
            setGoogleProfileImage(googleImage);
        } else if (userId) {
            fetchUserDetails(userId).then((data) => {
                if (data && data.profilePicturePath) {
                    setUserProfileImage(`http://localhost:8080/uploads/profile/${data.profilePicturePath}`);
                }
            });
        }
    }, [userId]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setIsVisible(false); // Hide navbar on scroll down
            } else {
                setIsVisible(true); // Show navbar on scroll up
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currentPath = window.location.pathname;

    // Style for menu items
    const menuItemStyle = (isActive, isHovered) => ({
        color: isActive ? '#047857' : isHovered ? '#047857' : '#10b981',
        cursor: 'pointer',
        transition: 'color 0.3s ease'
    });
    
    // Style for icons
    const iconStyle = (isActive, isHovered) => ({
        color: isActive ? '#047857' : isHovered ? '#047857' : '#10b981',
        cursor: 'pointer',
        transition: 'color 0.3s ease'
    });

    return (
        <div className={`navbar ${isVisible ? 'navbar_visible' : 'navbar_hidden'}`}>
            <div className="nav_con">
                <div className='nav_item_set'>
                    <div className='side_logoo'></div>
                    <div className='nav_bar_item'>

                        <p
                            className={`nav_nav_item ${currentPath === '/allPost' ? 'nav_nav_item_active' : ''}`}
                            onClick={() => (window.location.href = '/allPost')}
                            style={menuItemStyle(currentPath === '/allPost', hoveredItem === 'posts')}
                            onMouseEnter={() => setHoveredItem('posts')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            Skill Post
                        </p>
                        <p
                            className={`nav_nav_item ${currentPath === '/allLearningPlan' ? 'nav_nav_item_active' : ''}`}
                            onClick={() => (window.location.href = '/allLearningPlan')}
                            style={menuItemStyle(currentPath === '/allLearningPlan', hoveredItem === 'learning')}
                            onMouseEnter={() => setHoveredItem('learning')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            Learning Plan
                        </p>
                        <p
                            className={`nav_nav_item ${currentPath === '/allAchievements' ? 'nav_nav_item_active' : ''}`}
                            onClick={() => (window.location.href = '/allAchievements')}
                            style={menuItemStyle(currentPath === '/allAchievements', hoveredItem === 'achievements')}
                            onMouseEnter={() => setHoveredItem('achievements')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            Achievements
                        </p>
                        {allRead ? (
                            <MdNotifications
                                className={`nav_item_icon ${currentPath === '/notifications' ? 'nav_item_icon_noty' : ''}`}
                                onClick={() => (window.location.href = '/notifications')}
                                style={iconStyle(currentPath === '/notifications', hoveredItem === 'notifications')}
                                onMouseEnter={() => setHoveredItem('notifications')}
                                onMouseLeave={() => setHoveredItem(null)} />
                        ) : (
                            <MdNotificationsActive 
                                className='nav_item_icon_noty' 
                                onClick={() => (window.location.href = '/notifications')}
                                style={{color: '#047857'}}  />
                        )}
                        <IoLogOut
                            className='nav_item_icon'
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = '/';
                            }}
                            style={iconStyle(false, hoveredItem === 'logout')}
                            onMouseEnter={() => setHoveredItem('logout')}
                            onMouseLeave={() => setHoveredItem(null)}
                        />

                        {googleProfileImage ? (
                            <img
                                src={googleProfileImage}
                                alt="Google Profile"
                                className="nav_item_icon"
                                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = Pro;
                                }}
                                onClick={() => {
                                    window.location.href = '/googalUserPro';
                                }}
                            />
                        ) : userProfileImage ? (
                            <img
                                src={userProfileImage}
                                alt="User Profile"
                                className="nav_item_icon"
                                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = Pro;
                                }}
                                onClick={() => {
                                    window.location.href = '/userProfile';
                                }}
                            />
                        ) : (
                            <FaUserGraduate
                                className='nav_item_icon'
                                onClick={() => {
                                    window.location.href = '/userProfile';
                                }}
                                style={iconStyle(false, hoveredItem === 'profile')}
                                onMouseEnter={() => setHoveredItem('profile')}
                                onMouseLeave={() => setHoveredItem(null)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
