const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    let messages;
    if (user1 && user2) {
      messages = await Message.find({
        $or: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 }
        ]
      });
    } else {
      messages = await Message.find();
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /messages  
exports.createMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
