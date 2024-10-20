const express = require('express');
//const { createEvent, getAllEvents, showInterest } = require('../controllers/event.controller');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Admin creates an event
router.post('/create', createEvent);

// User views all events
router.get('/', getAllEvents);

// User shows interest in an event
router.post('/:eventId/interest', authMiddleware, showInterest);

module.exports = router;
