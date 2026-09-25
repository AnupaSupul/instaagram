const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  username:   { type: String, required: true },
  userImage:  { type: String, required: true },
  storyImage: { type: String, required: true },
  timestamp:  { type: String }
}, {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => { delete ret._id; }
  }
});

module.exports = mongoose.model('Story', storySchema);
