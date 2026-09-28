const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser
} = require('../controllers/userController');

// ── Public routes (no JWT required) ──
// GET  /users          — all users (or filtered by ?username=X for signup check)
// POST /users          — signup / create user
router.get('/', getUsers);
router.post('/', createUser);

// ── Protected routes (JWT required) ──
// GET   /users/:id     — single user by ID
// PATCH /users/:id     — update user (bio, profilePicture, etc.)
router.get('/:id', authMiddleware, getUserById);
router.patch('/:id', authMiddleware, updateUser);

module.exports = router;
