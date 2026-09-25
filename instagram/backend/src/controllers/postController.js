const Post = require('../models/Post');

// GET /posts  or  GET /posts?userId=X
exports.getPosts = async (req, res) => {
  try {
    const { userId } = req.query;
    // If userId is supplied, filter posts by the embedded user.id field
    const query = userId ? { 'user.id': userId } : {};
    const posts = await Post.find(query);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /posts  (create post or reel)
exports.createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /posts/:id  (partial update — likes, comments, savedBy, etc.)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
