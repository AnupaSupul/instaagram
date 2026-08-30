import { useEffect, useState } from 'react';
import {
  fetchNotifications,
  markNotificationRead,
} from '../../services/api';
import './Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read user from localStorage every render — same pattern as Posts.jsx / Profile.jsx
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser) return;

    fetchNotifications(currentUser.id)
      .then((data) => {
        // Show newest first
        setNotifications(data.slice().reverse());
      })
      .catch((err) =>
        console.error('Error fetching notifications:', err)
      )
      .finally(() => setLoading(false));
  }, []);

  const handleRead = (notification) => {
    if (notification.read) return;
    markNotificationRead(notification.id)
      .then((updated) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === updated.id ? updated : n))
        );
      });
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <span className="unread-count">
          {notifications.filter((n) => !n.read).length} unread
        </span>
      </div>

      {loading ? (
        <p className="notifications-empty">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="notifications-empty">No notifications yet.</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${notification.read ? 'read' : 'unread'}`}
              onClick={() => handleRead(notification)}
            >
              <div className="notification-icon">
                {notification.type === 'like' ? (
                  <i className="bi bi-heart-fill"></i>
                ) : (
                  <i className="bi bi-bell-fill"></i>
                )}
              </div>
              <div className="notification-body">
                <p>
                  <strong>{notification.fromUsername}</strong>{' '}
                  {notification.message}
                </p>
                <span className="notification-time">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
              {!notification.read && <span className="unread-dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
