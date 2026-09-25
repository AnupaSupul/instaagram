const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  type:       { type: String, default: 'chat' },
  senderId:   { type: String, required: true },
  receiverId:  { type: String, required: true },
  text:       { type: String, required: true },
  timestamp:  { type: String }
}, {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => { delete ret._id; }
  }
});

module.exports = mongoose.model('Message', messageSchema);
