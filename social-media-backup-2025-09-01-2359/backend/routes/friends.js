const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

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

// Send friend request
router.post('/request/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    if (target.friendRequests.includes(user._id) || target.friends.includes(user._id)) {
      return res.status(400).json({ message: 'Already requested or friends' });
    }
    target.friendRequests.push(user._id);
    await target.save();
    res.json({ message: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept friend request
router.post('/accept/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const requester = await User.findById(req.params.id);
    if (!user.friendRequests.includes(requester._id)) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }
    user.friends.push(requester._id);
    requester.friends.push(user._id);
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requester._id.toString());
    await user.save();
    await requester.save();
    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friends list
router.get('/list', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'username profilePicture');
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friend requests
router.get('/requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friendRequests', 'username profilePicture');
    res.json(user.friendRequests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
