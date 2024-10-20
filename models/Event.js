const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: Date,
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
