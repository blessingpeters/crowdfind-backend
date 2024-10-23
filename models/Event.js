const mongoose = require('mongoose');

const AttendeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  numberOfAttendees: { type: Number, default: 1, min: 1 }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hostname: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  img: { type: String },
  tags: [{ type: String }],
  attendees: [AttendeeSchema],
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
