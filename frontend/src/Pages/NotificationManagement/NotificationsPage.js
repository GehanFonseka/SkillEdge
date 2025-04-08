import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './notification.css'
import { RiDeleteBin6Fill } from "react-icons/ri";
import NavBar from '../../Components/NavBar/NavBar';
import { MdOutlineMarkChatRead } from "react-icons/md";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
        console.log('API Response:', response.data); // Debugging log
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userId) {
      fetchNotifications();
    } else {
      console.error('User ID is not available');
    }
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/notifications/${id}/markAsRead`);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div>
      <div className='continer'>
        <NavBar />
        <div className='continSection'>
          <div className='post_card_continer'>
            {notifications.length === 0 ? (
              <div className='not_found_box'>
                <div className='not_found_img'></div>
                <p className='not_found_msg'>No notifications found.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className={`post_card ${notification.read ? 'read' : 'unread'}`}>
                  <div className='continer_set'>
                    <p className='noty_topic'>{notification.message}</p>
                    <p className='noty_time'>{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                  <div className='noty_action_btn_con'>
                    <MdOutlineMarkChatRead onClick={() => handleMarkAsRead(notification.id)}
                      style={{ display: notification.read ? 'none' : 'inline-block' }} className='action_btn_icon' />
                    <RiDeleteBin6Fill
                      onClick={() => handleDelete(notification.id)}
                      className='action_btn_icon' />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
// Update 3 - 2025-03-19 - Enhanced notification functionality
// Update 5 - 2025-03-21 - Enhanced notification functionality
// Update 9 - 2025-03-25 - Enhanced notification functionality
// Update 15 - 2025-03-31 - Enhanced notification functionality
// Update 19 - 2025-04-04 - Enhanced notification functionality
// Update 20 - 2025-04-05 - Enhanced notification functionality
// Update 22 - 2025-04-07 - Enhanced notification functionality
// Update 26 - 2025-04-11 - Enhanced notification functionality
// Update 27 - 2025-04-12 - Enhanced notification functionality
// Update 0 - 2025-03-16 - Enhanced notification functionality
// Update 2 - 2025-03-18 - Enhanced notification functionality
// Update 8 - 2025-03-24 - Enhanced notification functionality
// Update 12 - 2025-03-28 - Enhanced notification functionality
// Update 16 - 2025-04-01 - Enhanced notification functionality
// Update 19 - 2025-04-04 - Enhanced notification functionality
// Update 22 - 2025-04-07 - Enhanced notification functionality
// Update 23 - 2025-04-08 - Enhanced notification functionality
