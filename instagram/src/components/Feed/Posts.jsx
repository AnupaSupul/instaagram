// src/Posts.jsx
import { useState, useEffect } from 'react';
import { fetchPosts,likePost,addComment,savePost,updatePost,deletePost,createNotification } from '../../services/api';
import './Posts.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [openComments, setOpenComments] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [sharePostId, setSharePostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(data))
      .catch((err) => console.log('Error fetching posts:', err));
  }, []);

    const handleDelete = (postId) => {
        deletePost(postId)
          .then((res) => {
            if (res.ok) {
              setPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== postId)
              );
            }
          })
          .catch((err) => {
            console.error('Error deleting post:', err);
          });
      };  

    const handleShare = async (post) => {
      const shareUrl = `${window.location.origin}/post/${post.id}`;

      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Post link copied!');
      } catch (err) {
        console.error('Error copying post link:', err);
      }
    };

    const handleComment = (post) => {
      const currentUser = JSON.parse(localStorage.getItem('user'));

      if (!currentUser || !commentText.trim()) return;

      const newComment = {
        id: crypto.randomUUID(),
        userId: currentUser.id,
        username: currentUser.username,
        text: commentText.trim(),
      };

      const updatedComments = [
        ...(post.comments || []),
        newComment,
      ];

      addComment(post.id, updatedComments)
        .then((updatedPost) => {
          setPosts((prevPosts) =>
            prevPosts.map((p) =>
              p.id === updatedPost.id ? updatedPost : p
            )
          );

          setCommentText('');
        })
        .catch((err) => {
          console.error('Error adding comment:', err);
        });
    };


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

                  // Create notification when another user likes the post
                  if (!alreadyLiked && post.user.id !== currentUser.id) {
                    return createNotification({
                      type: 'like',
                      fromUserId: currentUser.id,
                      fromUsername: currentUser.username,
                      toUserId: post.user.id,
                      postId: post.id,
                      message: 'liked your post',
                      timestamp: new Date().toISOString(),
                      read: false,
                    });
                  }
                })
                .catch((err) => {
                  console.error('Error updating like:', err);
                });
            };

                  const handleSave = (post) => {
                      const currentUser = JSON.parse(localStorage.getItem('user'));

                      if (!currentUser) return;

                      const userId = currentUser.id;

                      const alreadySaved = post.savedBy?.includes(userId);

                      const updatedSavedBy = alreadySaved
                        ? post.savedBy.filter((id) => id !== userId)
                        : [...(post.savedBy || []), userId];

                      savePost(post.id, updatedSavedBy)
                        .then((updatedPost) => {
                          setPosts((prevPosts) =>
                            prevPosts.map((p) =>
                              p.id === updatedPost.id ? updatedPost : p
                            )
                          );
                        })
                        .catch((err) => {
                          console.error('Error saving post:', err);
                        });
                    };


                    const handleEdit = (post) => {
                      setEditingPostId(post.id);
                      setEditCaption(post.caption);
                    };

                    const handleUpdatePost = (post) => {
                        updatePost(post.id, {
                          caption: editCaption,
                        })
                          .then((updatedPost) => {
                            setPosts((prevPosts) =>
                              prevPosts.map((p) =>
                                p.id === updatedPost.id ? updatedPost : p
                              )
                            );

                            setEditingPostId(null);
                            setEditCaption('');
                          })
                          .catch((err) => {
                            console.error('Error updating post:', err);
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
            <div className="post-actions">
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
              <i
                  className="bi bi-chat"
                  onClick={() =>
                    setOpenComments(
                      openComments === post.id ? null : post.id
                    )
                  }
                  style={{ cursor: 'pointer' }}
                ></i>

              <i
                className="bi bi-send"
                onClick={() => setSharePostId(post.id)}
                style={{ cursor: 'pointer' }}
              ></i>

              <i
                className={`bookmark ${
                  post.savedBy?.includes(
                    JSON.parse(localStorage.getItem('user'))?.id
                  )
                    ? 'bi bi-bookmark-fill'
                    : 'bi bi-bookmark'
                }`}
                onClick={() => handleSave(post)}
              ></i>

            </div>
            {/* ── Like Count ── */}
 
                <div className="post-options">
                    <button
                      className="menu-button"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === post.id ? null : post.id
                        )
                      }
                    >
                      <i className="bi bi-three-dots"></i>
                    </button>

                    {openMenuId === post.id && (
                      <div className="post-menu">
                        <button
                          onClick={() => {
                            handleEdit(post);
                            setOpenMenuId(null);
                          }}
                        >
                          Edit
                        </button>

                        <button
                            onClick={() => {
                              handleDelete(post.id);
                              setOpenMenuId(null);
                            }}
                          >
                            Delete
                          </button>
                      </div>
                    )}
                  </div>

            <div className="like-count">
              <strong>{post.likes} likes</strong>
            </div>

            {/* ── Caption ── */}
            <div className="post-caption">
              <strong>{post.user.username}</strong>
              <span>{post.caption}</span>
            </div>

            

                  {openComments === post.id && (
                <div className="comments-section">

                  {post.comments?.map((comment) => (
                    <div key={comment.id} className="comment">
                      <strong>{comment.username}</strong>{' '}
                      {comment.text}
                    </div>
                  ))}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleComment(post);
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />

                    <button type="submit">
                      Post
                    </button>
                  </form>

                </div>
              )}

              {sharePostId === post.id && (
                  <div className="share-modal-backdrop">
                    <div className="share-modal">
                      <div className="share-modal-header">
                        <h3>Share post</h3>

                        <button
                          onClick={() => setSharePostId(null)}
                          className="share-close-btn"
                        >
                          ×
                        </button>
                      </div>

                      <button
                        className="share-option"
                        onClick={() => {
                          handleShare(post);
                          setSharePostId(null);
                        }}
                      >
                        🔗 Copy link
                      </button>

                      <button
                        className="share-option"
                        onClick={() => setSharePostId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {editingPostId === post.id && (
                    <div className="edit-post-form">

                      <input
                        type="text"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                      />

                      <button onClick={() => handleUpdatePost(post)}>
                        Save
                      </button>

                      <button
                        onClick={() => {
                          setEditingPostId(null);
                          setEditCaption('');
                        }}
                      >
                        Cancel
                      </button>

                    </div>
                  )}

          </div>
        ))
      ) : (
        <p>Loading posts...</p>
      )}
    </div>
  );
}
export default Posts;