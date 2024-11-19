const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
require('dotenv').config();
const Event = require('../models/Event');

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

        // Create verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Create new user
        const user = new User({ name, email, password, verificationToken });
        await user.save();

        // Send verification email
        const verificationUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${verificationToken}`;

        const verificationEmail = `
            <h1>Email Verification</h1>
            <p>Hello ${user.name},</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>If you did not request this, please ignore this email.</p>
            <p>or copy and paste the url in your browser
            <a href="${verificationUrl}">${verificationUrl}</a>

        `;

        await sendEmail({
            to: user.email,
            subject: 'Verify Your Email',
            html: verificationEmail,
        });

        // Send welcome email
        const welcomeEmail = `
            <h1>Welcome to Crowd Find!</h1>
            <p>Thank you for registering. Please verify your email to access your dashboard.</p>
        `;

        await sendEmail({
            to: user.email,
            subject: 'Welcome to Crowd Find!',
            html: welcomeEmail,
        });

        res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
    } catch (err) {
        console.error('Error in registration:', err.message);
        res.status(500).json({ error: err.message });
    }
};
exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Invalid or missing token.' });
    }

    try {
        // Find user with the verification token
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid token or user already verified.' });
        }

        // Update user verification status
        user.isVerified = true;
        user.verificationToken = undefined; // Remove the token
        await user.save();

        // res.status(200).json({ message: 'Email verified successfully. You can now log in.' });

        // Redirect to the frontend verification success page
        // return res.redirect(`${process.env.CLIENT_URL}/email-verified`);'
        res.redirect("/verification-success.html");
        console.log( res.status(200).json({ message: 'Email verified successfully. You can now log in.' }))

    } catch (err) {
        console.error('Error in email verification:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Validate email presence
    if (!email) {
        return res.status(400).json({ message: 'Please provide your email address.' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'No user found with this email.' });
        }

        // Generate OTP (6-digit numeric token)
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Set reset token and expiration (1 hour)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send OTP email
        const resetEmail = `
            <h1>Password Reset OTP</h1>
            <p>Hello ${user.name},</p>
            <p>Your password reset OTP is:</p>
            <h2>${resetToken}</h2>
            <p>This OTP will expire in 1 hour.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
        `;

        await sendEmail({
            to: user.email,
            subject: 'Password Reset OTP',
            html: resetEmail,
        });

        res.status(200).json({ message: 'Password reset OTP sent to your email.' });
    } catch (err) {
        console.error('Error in forgotPassword:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { otp, newPassword } = req.body;

    // Validate input fields
    if (!otp || !newPassword) {
        return res.status(400).json({ message: 'OTP and new password are required.' });
    }

    // Validate password strength
    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        // Find user by OTP and ensure token is not expired
        const user = await User.findOne({
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // Update password and clear reset token fields
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Optionally, send confirmation email
        const confirmationEmail = `
            <h1>Password Reset Successful</h1>
            <p>Hello ${user.name},</p>
            <p>Your password has been successfully reset. You can now log in with your new password.</p>
        `;

        await sendEmail({
            to: user.email,
            subject: 'Password Reset Successful',
            html: confirmationEmail,
        });

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error('Error in resetPassword:', err.message);
        res.status(500).json({ error: err.message });
    }
};

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
exports.saveEvent = async (req, res) => {
    const { eventId } = req.params;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        // Check if event is already saved
        const isSaved = user.savedEvents.includes(eventId);

        if (isSaved) {
            // If already saved, remove it (unsave)
            user.savedEvents = user.savedEvents.filter(id => id.toString() !== eventId);
            await user.save();
            return res.status(200).json({ message: 'Event unsaved successfully.' });
        }

        // Otherwise, add it to saved events
        user.savedEvents.push(eventId);
        await user.save();

        res.status(200).json({ message: 'Event saved successfully.' });
    } catch (err) {
        console.error('Error in saveEvent:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getSavedEvents = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'savedEvents',
                select: 'title hostname description date img tags'
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            message: "Retrieved saved events successfully.",
            savedEvents: user.savedEvents,
        });
    } catch (err) {
        console.error('Error in getSavedEvents:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate([
                { path: 'interestedEvents.event', select: 'title hostname description date img tags' },
                { path: 'savedEvents', select: 'title hostname description date img tags' }
            ])
            .select('-password -verificationToken -resetPasswordToken -resetPasswordExpires -__v')
            .lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const profileData = {
            name: user.name,
            email: user.email,
            address: user.address,
            profilePicture: user.profilePicture,
            isVerified: user.isVerified,
            interestedEvents: user.interestedEvents,
            totalInterestedEvents: user.interestedEvents.length,
            savedEvents: user.savedEvents,
            totalSavedEvents: user.savedEvents.length,
        };

        res.status(200).json(profileData);
    } catch (err) {
        console.error('Error in getProfile:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateProfile = async (req, res) => {
    const { name, email, address } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (name) user.name = name;
        if (address) user.address = address;

        if (email && email !== user.email) {
            // Check if the new email is unique
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already in use by another account.' });
            }
            user.email = email;
            user.isVerified = false;

            // Generate new verification token
            const verificationToken = crypto.randomBytes(20).toString('hex');
            user.verificationToken = verificationToken;

            // Send verification email
            const verificationUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${verificationToken}`;

            const verificationEmail = `
                <h1>Email Verification</h1>
                <p>Hello ${user.name},</p>
                <p>You have updated your email. Please verify your new email by clicking the link below:</p>
                <a href="${verificationUrl}">Verify New Email</a>
                <p>If you did not request this change, please contact support.</p>
            `;

            await sendEmail({
                to: user.email,
                subject: 'Verify Your New Email',
                html: verificationEmail,
            });
        }

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (err) {
        console.error('Error in updateProfile:', err.message);
        res.status(500).json({ error: err.message });
    }
};
exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Use Cloudinary URL instead of local file path
        user.profilePicture = req.file.path; // Cloudinary provides the URL in `req.file.path`
        await user.save();

        res.status(200).json({ message: 'Profile picture updated successfully.', profilePicture: user.profilePicture });
    } catch (err) {
        console.error('Error in uploadProfilePicture:', err.message);
        res.status(500).json({ error: err.message });
    }
};

