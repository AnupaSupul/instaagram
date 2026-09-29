const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');

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

//  Middleware 
app.use(cors());
app.use(express.json());

//  Health check 
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

//  Public routes 
app.use('/',              authRoutes);         // POST /login
app.use('/users',         userRoutes);         // signup + check are public (auth applied per-route inside)

//  Protected routes 
app.use('/posts',         authMiddleware, postRoutes);         // CRUD /posts
app.use('/notifications', authMiddleware, notificationRoutes); // CRUD /notifications
app.use('/messages',      authMiddleware, messageRoutes);      // GET + POST /messages

//  Stories (protected) 
app.get('/stories', authMiddleware, async (_req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Suggestions (protected) 
app.get('/suggestions', authMiddleware, async (_req, res) => {
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

//  Profile (protected) 
app.get('/profile', authMiddleware, async (_req, res) => {
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

//  Start server 
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
});
