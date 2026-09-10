import { useState, useEffect } from 'react';
import { fetchPosts, likePost, addComment, savePost, deletePost, createNotification } from '../../services/api';
import './Reels.css';

function Reels() {
    const [reels, setReels] = useState([]);
    const [openComments, setOpenComments] = useState(null);
    const [commentText, setCommentText] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchPosts()
            .then((data) => setReels(data.filter((p) => p.type === 'reel')))
            .catch((err) => console.error('Error fetching reels:', err));
    }, []);

    // ── Like ──
    const handleLike = (reel) => {
        if (!currentUser) return;
        const userId = currentUser.id;
        const alreadyLiked = reel.likedBy?.includes(userId);

        const updatedLikedBy = alreadyLiked
            ? reel.likedBy.filter((id) => id !== userId)
            : [...(reel.likedBy || []), userId];

        const updatedLikes = alreadyLiked ? reel.likes - 1 : reel.likes + 1;

        likePost(reel.id, { likes: updatedLikes, likedBy: updatedLikedBy })
            .then((updated) => {
                setReels((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
                if (!alreadyLiked && reel.user.id !== currentUser.id) {
                    createNotification({
                        type: 'like',
                        fromUserId: currentUser.id,
                        fromUsername: currentUser.username,
                        toUserId: reel.user.id,
                        postId: reel.id,
                        message: 'liked your reel',
                        timestamp: new Date().toISOString(),
                        read: false,
                    });
                }
            })
            .catch((err) => console.error('Error liking reel:', err));
    };

    //  Comment 
    const handleComment = (reel) => {
        if (!currentUser || !commentText.trim()) return;

        const newComment = {
            id: crypto.randomUUID(),
            userId: currentUser.id,
            username: currentUser.username,
            text: commentText.trim(),
        };

        const updatedComments = [...(reel.comments || []), newComment];

        addComment(reel.id, updatedComments)
            .then((updated) => {
                setReels((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
                setCommentText('');
            })
            .catch((err) => console.error('Error commenting:', err));
    };

    // Save 
    const handleSave = (reel) => {
        if (!currentUser) return;
        const userId = currentUser.id;
        const alreadySaved = reel.savedBy?.includes(userId);

        const updatedSavedBy = alreadySaved
            ? reel.savedBy.filter((id) => id !== userId)
            : [...(reel.savedBy || []), userId];

        savePost(reel.id, updatedSavedBy)
            .then((updated) => {
                setReels((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            })
            .catch((err) => console.error('Error saving reel:', err));
    };

    const handleDelete = (reelId) => {
        deletePost(reelId)
            .then((res) => {
                if (res.ok) {
                    setReels((prev) => prev.filter((r) => r.id !== reelId));
                }
            })
            .catch((err) => console.error('Error deleting reel:', err));
    };

    return (
        <div className="reels-page">
            <h2 className="reels-title">
                <i className="bi bi-play-btn"></i> Reels
            </h2>

            {reels.length === 0 ? (
                <div className="reels-empty">
                    <i className="bi bi-camera-reels"></i>
                    <p>No reels yet. Create one from the Create button!</p>
                </div>
            ) : (
                <div className="reels-feed">
                    {reels.map((reel) => (
                        <div key={reel.id} className="reel-card">

                            <div className="reel-header">
                                <img
                                    src={reel.user.profile_pic}
                                    alt={reel.user.username}
                                    className="reel-avatar"
                                />
                                <span className="reel-username">{reel.user.username}</span>
                            </div>

                            
                            <video
                                className="reel-video"
                                src={reel.videoUrl}
                                controls
                                muted
                                loop
                                playsInline
                            />

                            <div className="reel-actions">
                                <i
                                    className={
                                        reel.likedBy?.includes(currentUser?.id)
                                            ? 'bi bi-heart-fill text-danger'
                                            : 'bi bi-heart'
                                    }
                                    onClick={() => handleLike(reel)}
                                ></i>
                                <i
                                    className="bi bi-chat"
                                    onClick={() =>
                                        setOpenComments(openComments === reel.id ? null : reel.id)
                                    }
                                ></i>
                                <i
                                    className={
                                        reel.savedBy?.includes(currentUser?.id)
                                            ? 'bi bi-bookmark-fill'
                                            : 'bi bi-bookmark'
                                    }
                                    onClick={() => handleSave(reel)}
                                ></i>
                                {reel.user.id === currentUser?.id && (
                                    <i
                                        className="bi bi-trash delete-icon"
                                        onClick={() => handleDelete(reel.id)}
                                    ></i>
                                )}
                            </div>

                            <div className="reel-likes">
                                <strong>{reel.likes} likes</strong>
                            </div>

                            <div className="reel-caption">
                                <strong>{reel.user.username}</strong> {reel.caption}
                            </div>

                            {openComments === reel.id && (
                                <div className="reel-comments">
                                    {reel.comments?.map((c) => (
                                        <div key={c.id} className="reel-comment">
                                            <strong>{c.username}</strong> {c.text}
                                        </div>
                                    ))}
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleComment(reel);
                                        }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                        />
                                        <button type="submit">Post</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Reels;
