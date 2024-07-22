const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const VideoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

VideoSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Video', VideoSchema);
