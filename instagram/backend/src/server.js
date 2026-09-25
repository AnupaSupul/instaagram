const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

// Route imports
const authRoutes         = require('./routes/authRoutes');
const userRoutes         = require('./routes/userRoutes');
const postRoutes         = require('./routes/postRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes      = require('./routes/messageRoutes');

// Model imports (for inline story/suggestion/profile routes)
const Story = require('./models/Story');
const User  = require('./models/User');

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ── Main routes ──
app.use('/',              authRoutes);         // POST /login
app.use('/users',         userRoutes);         // CRUD /users
app.use('/posts',         postRoutes);         // CRUD /posts
app.use('/notifications', notificationRoutes); // CRUD /notifications
app.use('/messages',      messageRoutes);      // GET + POST /messages

// ── Stories (simple inline — no separate controller needed) ──
app.get('/stories', async (_req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Suggestions (derived from users — no separate model needed) ──
app.get('/suggestions', async (_req, res) => {
  try {
    const users = await User.find().limit(5).select('-password');
    const suggestions = users.map((u) => ({
      id: u.id,
      username: u.username,
      profile_pic: u.profilePicture
    }));
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Profile (returns first user as a placeholder — proper handling in Phase 4) ──
app.get('/profile', async (_req, res) => {
  try {
    const user = await User.findOne().select('-password');
    if (!user) return res.json({});
    res.json({
      id: user.id,
      username: user.username,
      profile_pic: user.profilePicture
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Start server ──
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
});
