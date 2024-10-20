const express = require('express');
const { register, login, getInterestedEvents } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/interested-events', authMiddleware, getInterestedEvents);

module.exports = router;