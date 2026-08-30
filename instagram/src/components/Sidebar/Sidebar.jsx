import instagramTextLogo from '../../assets/instagram.webp';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ onCreate }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <img
          src={instagramTextLogo}
          alt="Instagram"
        />
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <NavLink to="/" className="sidebar-item">
          <i className="bi bi-house-door-fill"></i>
          <span>Home</span>
        </NavLink>

        <NavLink to="/search" className="sidebar-item">
          <i className="bi bi-search"></i>
          <span>Search</span>
        </NavLink>

        <NavLink to="/explore" className="sidebar-item">
          <i className="bi bi-compass"></i>
          <span>Explore</span>
        </NavLink>

        <NavLink to="/reels" className="sidebar-item">
          <i className="bi bi-play-btn"></i>
          <span>Reels</span>
        </NavLink>

        <NavLink to="/messages" className="sidebar-item">
          <i className="bi bi-chat-dots"></i>
          <span>Messages</span>
        </NavLink>

        <NavLink to="/notifications" className="sidebar-item">
          <i className="bi bi-heart"></i>
          <span>Notifications</span>
        </NavLink>

        <button
          className="sidebar-item sidebar-button"
          onClick={onCreate}
        >
          <i className="bi bi-plus-square"></i>
          <span>Create</span>
        </button>

        <NavLink to="/profile" className="sidebar-item">
          <i className="bi bi-person"></i>
          <span>Profile</span>
        </NavLink>

      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">

        <button className="sidebar-item sidebar-button">
          <i className="bi bi-threads"></i>
          <span>Threads</span>
        </button>

        <button className="sidebar-item sidebar-button">
          <i className="bi bi-list"></i>
          <span>More</span>
        </button>

        <button
          className="sidebar-item sidebar-button sidebar-logout"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-left"></i>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;