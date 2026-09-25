const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser
} = require('../controllers/userController');

// GET  /users        — all users (or filtered by ?username=X)
// POST /users        — signup / create user
router.get('/', getUsers);
router.post('/', createUser);

// GET   /users/:id   — single user by ID
// PATCH /users/:id   — update user (bio, profilePicture, etc.)
router.get('/:id', getUserById);
router.patch('/:id', updateUser);

module.exports = router;
