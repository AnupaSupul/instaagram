const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser
} = require('../controllers/userController');


router.get('/', getUsers);
router.post('/', createUser);


router.get('/:id', authMiddleware, getUserById);
router.patch('/:id', authMiddleware, updateUser);

module.exports = router;
