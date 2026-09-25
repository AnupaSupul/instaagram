const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:          { type: String, required: true },
  fullName:       { type: String, required: true },
  username:       { type: String, required: true, unique: true },
  password:       { type: String, required: true },
  profilePicture: { type: String, default: '' },
  bio:            { type: String, default: '' }
}, {
  // Expose "id" instead of "_id" so the frontend doesn't need to change
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => { delete ret._id; }
  }
});

module.exports = mongoose.model('User', userSchema);
