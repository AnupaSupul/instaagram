import { useEffect, useState } from 'react';
import './CreatePostModal.css';

function CreatePostModal({ onClose }) {
  const [user, setUser] = useState(null);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/userProfile')
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching profile:', err));
  }, []);

  const handleCreatePost = (e) => {
    e.preventDefault();

    if (!user) return;

    const newPost = {
      user: {
        id: user.id,
        username: user.username,
        profile_pic: user.profilePicture,
      },
      image: image || 'https://picsum.photos/600/600',
      caption,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
    };

    fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .then(() => {
        setCaption('');
        setImage('');
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
          <h3>Create new post</h3>

          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
          />

          <button type="submit" className="post-btn">
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;