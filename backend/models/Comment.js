const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  videoId: { type: Number, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
