// src/Posts.jsx
import { useState, useEffect } from 'react';
import { fetchPosts } from '../../services/api';


function Posts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(data))
      .catch((err) => console.log('Error fetching posts:', err));
  }, []);
  return (
    <div className="d-flex flex-column align-items-center">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post my-3">
            {/* ── Header: profile pic + username ── */}
            <div className="d-flex align-items-center mb-2">
              <img
                src={post.user.profile_pic}
                alt="Profile"
                className="dp rounded-circle me-2"
              />
              <h5 className="m-0 fs-6 fw-bold">{post.user.username}</h5>
            </div>
            {/* ── Post Image ── */}
            <img
              src={post.image}
              alt="Post"
              className="post-img w-100 rounded"
            />
            {/* ── Action Icons ── */}
            <div className="d-flex gap-3 my-2 fs-5">
              <i className="bi bi-heart"></i>
              <i className="bi bi-chat"></i>
              <i className="bi bi-send"></i>
            </div>
            {/* ── Like Count ── */}
            <div>
              <strong>{post.likes} likes</strong>
            </div>
            {/* ── Caption ── */}
            <div>
              <span className="fw-bold me-2">{post.user.username}</span>
              <span>{post.caption}</span>
            </div>
          </div>
        ))
      ) : (
        <p>Loading posts...</p>
      )}
    </div>
  );
}
export default Posts;