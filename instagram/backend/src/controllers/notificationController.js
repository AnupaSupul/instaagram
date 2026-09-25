const Notification = require('../models/Notification');

// GET /notifications  or  GET /notifications?toUserId=X
exports.getNotifications = async (req, res) => {
  try {
    const { toUserId } = req.query;
    const query = toUserId ? { toUserId } : {};
    const notifications = await Notification.find(query);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /notifications
exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /notifications/:id  (mark as read, etc.)
exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
