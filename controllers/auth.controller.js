const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Register User
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
     // Validate input fields
     if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide your credentials.' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    // Validate password strength (example: minimum 6 characters)
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '8h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get User's Interested Events
exports.getInterestedEvents = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'interestedEvents.event',
                select: 'title hostname description date img tags'
            });
        res.json(user.interestedEvents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
