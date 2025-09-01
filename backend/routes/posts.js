const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const router = express.Router();

// Multer setup for post media uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Middleware to verify token
function auth(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

// Create post
router.post('/', auth, upload.single('media'), async (req, res) => {
  try {
    const { content, tags } = req.body;
    let image = '', video = '';
    if (req.file) {
      if (req.file.mimetype.startsWith('image/')) image = req.file.path;
      else if (req.file.mimetype.startsWith('video/')) video = req.file.path;
    }
    const post = new Post({
      user: req.user.id,
      content,
      image,
      video,
      tags: tags ? tags.split(',') : [],
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get news feed (posts from friends)
router.get('/feed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friends = user.friends;
    const posts = await Post.find({ user: { $in: [...friends, req.user.id] } })
      .sort({ createdAt: -1 })
      .populate('user', 'username profilePicture')
      .populate('tags', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's posts
router.get('/user/:id', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'username profilePicture')
      .populate('tags', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
