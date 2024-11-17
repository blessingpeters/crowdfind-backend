const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
    register,
    login,
    getInterestedEvents,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile,
    uploadProfilePicture,
    saveEvent,
    getSavedEvents,
} = require("../controllers/auth.controller");
const router = express.Router();
const { body } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_pictures',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage });

// Registration Route with Validation
router.post("/register", [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
], register);

// Email Verification Route
router.get("/verify-email", verifyEmail);

// Login Route with Validation
router.post("/login", [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
], login);

// Forgot Password Route with Validation
router.post("/forgot-password", [
    body('email', 'Please include a valid email').isEmail()
], forgotPassword);

// Reset Password Route with Validation
router.post("/reset-password", [
    body('token', 'Token is required').not().isEmpty(),
    body('newPassword', 'Password must be at least 6 characters').isLength({ min: 6 })
], resetPassword);

// Save Event Route
router.post("/save-event/:eventId", authMiddleware, saveEvent);
router.get("/saved-events", authMiddleware, getSavedEvents);

// Get User Profile
router.get("/profile", authMiddleware, getProfile);

// Update User Profile with Validation
router.put("/profile", [
    authMiddleware,
    body('name').optional().isString().isLength({ max: 50 }),
    body('email').optional().isEmail().isLength({ max: 100 }),
    body('address').optional().isString().isLength({ max: 200 })
], updateProfile);

// Upload Profile Picture (Cloudinary Integration)
router.post("/profile/picture", authMiddleware, upload.single('profilePicture'), uploadProfilePicture);

// Get Interested Events
router.get("/interested-events", authMiddleware, getInterestedEvents);

module.exports = router;
