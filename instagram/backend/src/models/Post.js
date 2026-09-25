const mongoose = require('mongoose');

// ── Embedded sub-schemas (no Mongoose _id, they use their own id field) ──

const commentSchema = new mongoose.Schema({
  id:       { type: String, required: true },
  userId:   { type: String, required: true },
  username: { type: String, required: true },
  text:     { type: String, required: true }
}, { _id: false });

const postUserSchema = new mongoose.Schema({
  id:          { type: String, required: true },
  username:    { type: String, required: true },
  profile_pic: { type: String, default: '' }
}, { _id: false });

// ── Post schema ──

const postSchema = new mongoose.Schema({
  user:      { type: postUserSchema, required: true },
  image:     { type: String },
  caption:   { type: String, default: '' },
  likes:     { type: Number, default: 0 },
  likedBy:   [{ type: String }],
  comments:  [commentSchema],
  timestamp: { type: String },
  savedBy:   [{ type: String }],
  type:      { type: String, default: 'post' },   // "post" or "reel"
  videoUrl:  { type: String }                      // only for reels
}, {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => { delete ret._id; }
  }
});

module.exports = mongoose.model('Post', postSchema);
