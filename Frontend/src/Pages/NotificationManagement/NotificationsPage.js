import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './notification.css'
import { RiDeleteBin6Fill } from "react-icons/ri";
import NavBar from '../../components/NavBar/NavBar';
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
                    {!notification.read && (
                      <button 
                        onClick={() => handleMarkAsRead(notification.id)}
                        className='notification_action_btn mark_read_btn'
                        type="button"
                      >
                        <MdOutlineMarkChatRead size={35} className='btn_icon' />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className='notification_action_btn delete_btn'
                      type="button"
                    >
                      <RiDeleteBin6Fill size={35} className='btn_icon' />
                    </button>
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
// Update 2 - 2025-03-18 - Enhanced notification functionality
// Update 4 - 2025-03-20 - Enhanced notification functionality
// Update 6 - 2025-03-22 - Enhanced notification functionality
// Update 10 - 2025-03-26 - Enhanced notification functionality
// Update 13 - 2025-03-29 - Enhanced notification functionality
// Update 16 - 2025-04-01 - Enhanced notification functionality
// Update 18 - 2025-04-03 - Enhanced notification functionality
