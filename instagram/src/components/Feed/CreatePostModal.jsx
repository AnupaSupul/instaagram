import { useEffect, useState } from 'react';
import './CreatePostModal.css';
import {
  createPost,
} from '../../services/api';

function CreatePostModal({ onClose }) {
  const [user, setUser] = useState(null);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [mode, setMode] = useState('post'); // 'post' or 'reel'

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleCreatePost = (e) => {
    e.preventDefault();

    if (!user) return;

    const base = {
      user: {
        id: user.id,
        username: user.username,
        profile_pic: user.profilePicture,
      },
      caption,
      likes: 0,
      likedBy: [],
      comments: [],
      savedBy: [],
      timestamp: new Date().toISOString(),
    };

    const newPost =
      mode === 'reel'
        ? { ...base, type: 'reel', videoUrl: videoUrl || '' }
        : { ...base, type: 'post', image: image || 'https://picsum.photos/600/600' };

    createPost(newPost)
      .then(() => {
        setCaption('');
        setImage('');
        setVideoUrl('');
        onClose();
        window.location.reload();
      })
      .catch((err) => {
        console.error('Error creating post:', err);
      });
  };

  return (
    <div className="modal-backdrop">
      <div className="create-modal">
        <div className="modal-header">
          <h3>Create new {mode === 'reel' ? 'reel' : 'post'}</h3>

          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        {/* Mode toggle */}
        <div className="mode-toggle">
          <button
            className={mode === 'post' ? 'active' : ''}
            onClick={() => setMode('post')}
            type="button"
          >
            <i className=""></i> Post
          </button>
          <button
            className={mode === 'reel' ? 'active' : ''}
            onClick={() => setMode('reel')}
            type="button"
          >
            <i className=""></i> Reel
          </button>
        </div>

        <form onSubmit={handleCreatePost}>
          {mode === 'post' ? (
            <input
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          ) : (
            <>
              <input
                type="text"
                placeholder="Video URL (e.g. https://example.com/video.mp4)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              {videoUrl && (
                <video
                  className="reel-preview"
                  src={videoUrl}
                  controls
                  muted
                  playsInline
                />
              )}
            </>
          )}

          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
          />

          <button type="submit" className="post-btn">
            {mode === 'reel' ? 'Post Reel' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;