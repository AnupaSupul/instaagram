const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type:         { type: String, required: true },   // "like", "comment", etc.
  fromUserId:   { type: String, required: true },
  fromUsername:  { type: String, required: true },
  toUserId:     { type: String, required: true },
  postId:       { type: String },
  message:      { type: String, required: true },
  timestamp:    { type: String },
  read:         { type: Boolean, default: false }
}, {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => { delete ret._id; }
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
