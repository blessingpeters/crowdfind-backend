const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const InterestedEventSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    numberOfAttendees: { type: Number, default: 1, min: 1 }
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, maxlength: 100 },
    password: { type: String, required: true },
    savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    interestedEvents: [InterestedEventSchema],
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    profilePicture: { type: String },
    address: { type: String, maxlength: 200 },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
