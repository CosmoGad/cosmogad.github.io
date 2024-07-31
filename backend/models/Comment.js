const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  photoUrl: String,
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
