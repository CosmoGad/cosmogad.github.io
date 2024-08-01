const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Video = require('../models/Video');
const authMiddleware = require('../middleware/auth');

router.get('/:videoUrl', async (req, res) => {
  console.log(`Received GET request for comments. VideoUrl: ${req.params.videoUrl}`);
  try {
    const video = await Video.findOne({ url: req.params.videoUrl });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    const comments = await Comment.find({ videoId: video._id }).populate('userId', 'username photoUrl');
    console.log(`Found ${comments.length} comments for video ${video._id}`);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: error.message });
  }
});

// ... остальной код маршрутов
router.post('/', authMiddleware, async (req, res) => {
  console.log('Received POST request to add a comment:', req.body);
  try {
    const video = await Video.findOne({ url: req.body.videoUrl });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    const newComment = new Comment({
      videoId: video._id,
      userId: req.user._id,
      username: req.user.username,
      text: req.body.text
    });
    const savedComment = await newComment.save();
    console.log('New comment saved:', savedComment);
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }
    comment.text = req.body.text;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    await comment.remove();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
