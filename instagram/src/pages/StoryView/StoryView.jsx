// src/StoryView.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StoryView.css';

export default function StoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStory, setCurrentStory] = useState(null);
  const [allStories, setAllStories] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3000/stories')
      .then((res) => res.json())
      .then((data) => {
        setAllStories(data);
        // Find the story that matches the current URL id
        const selected = data.find((s) => s.id === id);
        setCurrentStory(selected);
      });
  }, [id]);   // re-runs when id changes - navigating story to story
  if (!currentStory) return <div className="loading">Loading story...</div>;
  const currentIndex = allStories.findIndex((s) => s.id === id);
  const handleNext = () => {
    if (currentIndex < allStories.length - 1) {
      navigate(`/story/${allStories[currentIndex + 1].id}`);
    } else {
      navigate('/');   // last story → back to home
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      navigate(`/story/${allStories[currentIndex - 1].id}`);
    } else {
      navigate('/');   // first story → back to home
    }
  };
  return (
    <div className="story-view-container">
      <div className="story-card">
        {/* ── Header: avatar + username + close ── */}
        <div className="story-header">
          <img src={currentStory.userImage} alt={currentStory.username} />
          <span>{currentStory.username}</span>
          <button className="close-btn" onClick={() => navigate('/')}>✕</button>
        </div>
        {/* ── Story image ── */}
        <img
          src={currentStory.storyImage}
          alt="Story"
          className="story-media"
        />
        {/* ── Prev / Next navigation ── */}
        <div className="story-nav">
          <button onClick={handlePrev} className="nav-btn left">‹</button>
          <button onClick={handleNext} className="nav-btn right">›</button>
        </div>
      </div>
    </div>
  );
}

