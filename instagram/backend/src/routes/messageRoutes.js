const express = require('express');
const router = express.Router();
const { getMessages, createMessage } = require('../controllers/messageController');

// GET  /messages      — filtered by ?user1=X&user2=Y
// POST /messages      — persist a message
router.get('/', getMessages);
router.post('/', createMessage);

module.exports = router;
