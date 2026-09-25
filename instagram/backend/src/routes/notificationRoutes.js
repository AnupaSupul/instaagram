const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  updateNotification
} = require('../controllers/notificationController');

// GET   /notifications        — all (or filtered by ?toUserId=X)
// POST  /notifications        — create notification
router.get('/', getNotifications);
router.post('/', createNotification);

// PATCH /notifications/:id    — mark as read, etc.
router.patch('/:id', updateNotification);

module.exports = router;
