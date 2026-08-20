import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStories } from '../../services/api';
import './Stories.css';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchStories()
      .then((data) => setStories(data))
      .catch((err) => console.error('Error fetching stories:', err));
  }, []);
  const handleStoryClick = (storyId) => {
    navigate(`/story/${storyId}`);
  };
  return (
    <div className="stories-container">
      {stories.map((story) => (
        <div
          key={story.id}
          className="story-avatar"
          onClick={() => handleStoryClick(story.id)}
        >
          <div className="gradient-border">
            <img src={story.userImage} alt={story.username} />
          </div>
          <p className="username">{story.username}</p>
        </div>
      ))}
    </div>
  );
}