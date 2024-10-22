const Event = require("../models/Event");
const User = require("../models/User");

// Admin creates an event
const createEvent = async (req, res) => {
  const { title, description, date } = req.body;
  try {
    const event = new Event({ title, description, date });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User views all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("attendees", "name");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User shows interest in an event
const showInterest = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const user = await User.findById(req.user.id);
    if (!user.interestedEvents.includes(eventId)) {
      user.interestedEvents.push(eventId);
      event.attendees.push(user._id);
      await user.save();
      await event.save();
    }

    res.json({ message: "Event has been Booked Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { createEvent, showInterest, getAllEvents };
