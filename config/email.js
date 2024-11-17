const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for SSL (port 465)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // For testing purposes only
    },
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to Gmail SMTP server:', error);
    } else {
        console.log('Gmail SMTP server is ready to take our messages');
    }
});

module.exports = transporter;
