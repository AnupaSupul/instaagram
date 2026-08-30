// src/Profile.jsx
import { useEffect, useState } from 'react';
import './Profile.css';
import { deletePost, createPost, fetchPosts, updateUserBio } from '../../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (!currentUser) return;

    setUser(currentUser);
    setBioInput(currentUser.bio || '');

    fetchPosts()
      .then((data) => {
        const myPosts = data.filter(
          (post) => post.user?.id === currentUser.id
        );

        setUserPosts(myPosts);
      })
      .catch((err) =>
        console.error('Error fetching posts:', err)
      );
  }, []);
  // UPDATE
  const handleUpdateBio = (e) => {
    e.preventDefault();

    updateUserBio(user.id, bioInput)
      .then((updatedUser) => {
        setUser(updatedUser);

        localStorage.setItem(
          'user',
          JSON.stringify(updatedUser)
        );

        setIsEditing(false);
      })
      .catch((err) => {
        console.error('Error updating bio:', err);
      });
  };
  // CREATE
  const handleCreatePost = (e) => {
    e.preventDefault();

    const newPost = {
      user: {
        id: user.id,
        username: user.username,
        profile_pic: user.profilePicture,
      },
      image: newPostImage || 'https://picsum.photos/600/600',
      caption: newPostCaption,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
    };
    createPost(newPost)
      .then((createdPost) => {
        setUserPosts([createdPost, ...userPosts]);   // prepend to top
        setNewPostCaption('');
        setNewPostImage('');
      })
      .catch((err) => console.error('Error creating post:', err));
  };
  // DELETE
  const handleDeletePost = (postId) => {
    deletePost(postId)
      .then((res) => {
        if (res.ok) {
          // Remove from local state — no refetch
          setUserPosts(userPosts.filter((post) => post.id !== postId));
        }
      })
      .catch((err) => console.error('Error deleting post:', err));
  };
  if (!user) return <div>Loading profile...</div>;
  return (
    <div className="profile-container">
      {/* ── Profile Header ── */}
      <div className="profile-header">
        <img src={user.profilePicture} alt={user.username} className="profile-pic" />
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p className="bio">{user.bio}</p>
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Bio'}
          </button>
          {isEditing && (
            <form onSubmit={handleUpdateBio} className="edit-bio-form">
              <input
                type="text"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="Enter new bio..."
              />
              <button type="submit">Save</button>
            </form>
          )}
        </div>
      </div>
      {/* ── Create Post ── */}
      <div className="create-post-section">
        <h3>Create New Post</h3>
        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            placeholder="Image URL"
            value={newPostImage}
            onChange={(e) => setNewPostImage(e.target.value)}
          />
          <input
            type="text"
            placeholder="Caption"
            value={newPostCaption}
            onChange={(e) => setNewPostCaption(e.target.value)}
            required
          />
          <button type="submit">Post</button>
        </form>
      </div>
      {/* ── Posts Grid ── */}
      <div className="profile-grid">
        {userPosts.map((post) => (
          <div key={post.id} className="grid-item">
            <img src={post.postImage} alt={post.caption} />
            <div className="grid-overlay">
              <p>{post.caption}</p>
              <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

