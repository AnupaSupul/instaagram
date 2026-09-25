const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

// GET    /posts         — all posts (or filtered by ?userId=X)
// POST   /posts         — create a post or reel
router.get('/', getPosts);
router.post('/', createPost);

// PATCH  /posts/:id     — partial update (likes, comments, savedBy, etc.)
// DELETE /posts/:id     — delete post
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
