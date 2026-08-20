// src/Sidebar.jsx
import instagramTextLogo from '../../assets/instagram.webp';
import { Link } from 'react-router-dom';


function Sidebar({ onCreate }) {
  return (
    <div className="w-20 m-3">
      {/* Main nav - flows top to bottom */}
      <div className="d-flex flex-column gap-3">
        {/* Instagram text logo */}
        <img
          src={instagramTextLogo}
          alt="Instagram"
          className="logo-text"
        />
        {/* Navigation links */}
        <div className="nav-item"><i className="bi bi-house-door-fill"></i> Home</div>
<div className="nav-item"><i className="bi bi-search"></i> Search</div>
        <div className="nav-item"><i className="bi bi-compass"></i> Explore</div>
        <div className="nav-item"><i className="bi bi-play-btn"></i> Reels</div>
        <div className="nav-item"><i className="bi bi-chat-dots"></i> Messages</div>
        <div className="nav-item"><i className="bi bi-heart"></i> Notifications</div>
        <div className="nav-item"
          onClick={onCreate}
          style={{ cursor: 'pointer' }}><i className="bi bi-plus-square"></i> Create</div>
        <Link to="/profile">
        <i className="bi bi-person"></i> Profile
      </Link>
      </div>
      {/* Bottom links - pinned to the bottom of the viewport */}
      <div className="d-flex flex-column gap-3 position-fixed bottom-0 mb-3">
        <div><i className="bi bi-threads"></i> Threads</div>
        <div><i className="bi bi-list"></i> More</div>
      </div>
    </div>
  );
}
export default Sidebar;