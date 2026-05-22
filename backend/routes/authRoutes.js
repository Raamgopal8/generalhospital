const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getStats, getUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/stats', protect, adminOnly, getStats);
router.get('/users', protect, adminOnly, getUsers);

module.exports = router;
