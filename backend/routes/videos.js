const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.query;

    let query = {};
    if (searchQuery) {
      query = {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } }
        ]
      };
    }

    const videos = await Video.find(query)
      .skip(skip)
      .limit(limit)
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    const total = await Video.countDocuments(query);

    console.log('Sending videos:', videos);
    res.json({
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
    const video = new Video({
        url: req.body.url,
        title: req.body.title,
        description: req.body.description,
        user: req.user._id
    });

    try {
        const newVideo = await video.save();
        res.status(201).json(newVideo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const likeIndex = video.likes.indexOf(req.user._id);
        if (likeIndex > -1) {
            video.likes.splice(likeIndex, 1);
        } else {
            video.likes.push(req.user._id);
        }

        await video.save();
        res.json({ likes: video.likes.length });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
