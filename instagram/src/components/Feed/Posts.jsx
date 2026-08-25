// src/Posts.jsx
import { useState, useEffect } from 'react';
import { fetchPosts,likePost } from '../../services/api';


function Posts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(data))
      .catch((err) => console.log('Error fetching posts:', err));
  }, []);


const handleLike = (post) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  if (!currentUser) return;

  const userId = currentUser.id;

  const alreadyLiked = post.likedBy?.includes(userId);

  const updatedLikedBy = alreadyLiked
    ? post.likedBy.filter((id) => id !== userId)
    : [...(post.likedBy || []), userId];

  const updatedLikes = alreadyLiked
    ? post.likes - 1
    : post.likes + 1;

  likePost(post.id, {
    likes: updatedLikes,
    likedBy: updatedLikedBy,
  })
    .then((updatedPost) => {
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === updatedPost.id ? updatedPost : p
        )
      );
    })
    .catch((err) => {
      console.error('Error updating like:', err);
    });
};


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
            <i
                  className={
                    post.likedBy?.includes(
                      JSON.parse(localStorage.getItem('user'))?.id
                    )
                      ? 'bi bi-heart-fill text-danger'
                      : 'bi bi-heart'
                  }
                  onClick={() => handleLike(post)}
                  style={{ cursor: 'pointer' }}
            ></i>
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