import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStories, createStory } from '../../services/api';
import './Stories.css';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [storyImage, setStoryImage] = useState('');
  const navigate = useNavigate();

  const loadStories = () => {
    fetchStories()
      .then((data) => setStories(data))
      .catch((err) => console.error('Error fetching stories:', err));
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleStoryClick = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  const handleCreateStory = (e) => {
    e.preventDefault();
    if (!storyImage.trim()) return;

    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) return;

    const newStory = {
      username: currentUser.username,
      userImage: currentUser.profilePicture || '',
      storyImage: storyImage.trim(),
      timestamp: new Date().toISOString(),
    };

    createStory(newStory)
      .then(() => {
        setStoryImage('');
        setShowModal(false);
        loadStories();
      })
      .catch((err) => console.error('Error creating story:', err));
  };

  return (
    <>
      <div className="stories-container">
        {/* Add Story Button */}
        <div className="story-avatar" onClick={() => setShowModal(true)}>
          <div className="add-story-btn">
            <i className="bi bi-plus-lg"></i>
          </div>
          <p className="username">Your story</p>
        </div>

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

      {/* Create Story Modal */}
      {showModal && (
        <div className="story-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="story-modal" onClick={(e) => e.stopPropagation()}>
            <div className="story-modal-header">
              <h3>Create Story</h3>
              <button className="story-close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateStory}>
              <input
                type="url"
                placeholder="Paste story image URL..."
                value={storyImage}
                onChange={(e) => setStoryImage(e.target.value)}
                required
              />

              {storyImage.trim() && (
                <div className="story-preview">
                  <img src={storyImage} alt="Preview" />
                </div>
              )}

              <div className="story-modal-actions">
                <button
                  type="button"
                  className="story-cancel-btn"
                  onClick={() => { setStoryImage(''); setShowModal(false); }}
                >
                  Cancel
                </button>
                <button type="submit" className="story-submit-btn">
                  Create Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}