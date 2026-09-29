const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  updateNotification
} = require('../controllers/notificationController');


router.get('/', getNotifications);
router.post('/', createNotification);

router.patch('/:id', updateNotification);

module.exports = router;
