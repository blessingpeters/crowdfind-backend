const Event = require("../models/Event");
const User = require("../models/User");

// Admin creates an event
const createEvent = async (req, res) => {
  const { title, hostname, description, date, img, tags } = req.body;

  if (!title || !date) {
    return res.status(400).json({ message: "Title and Date are required." });
  }

  try {
    const event = new Event({ title, hostname, description, date, img, tags });
    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User views all events
const getAllEvents = async (req, res) => {
    try {
      const events = await Event.find()
        .populate("attendees.user", "name")
        .lean();

      const eventsWithAttendeeDetails = events.map(event => {
          const totalAttendees = event.attendees.reduce((sum, attendee) => sum + (attendee.numberOfAttendees || 0), 0);

          // Check if attendees.user exists before accessing user.name
          const attendeeDetails = event.attendees.map(attendee => ({
              name: attendee.user ? attendee.user.name : "Unknown User",
              numberOfAttendees: attendee.numberOfAttendees
          }));

        return {
          ...event,
          totalAttendees,
          attendees: attendeeDetails
        };
      });

      res.json(eventsWithAttendeeDetails);
  } catch (err) {
      console.error("Error in getAllEvents:", err.message);
      res.status(500).json({ error: err.message });
    }
};

// User shows interest in an event
const showInterest = async (req, res) => {
    const { eventId } = req.params;
    const { numberOfAttendees } = req.body;

    if (!numberOfAttendees || numberOfAttendees < 1) {
      return res.status(400).json({ message: "Number of attendees must be at least 1." });
    }

    try {
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const existingInterest = user.interestedEvents.find(
        (ie) => ie.event && ie.event.toString() === eventId
      );

      if (existingInterest) {
        existingInterest.numberOfAttendees = numberOfAttendees;
      } else {
        user.interestedEvents.push({ event: eventId, numberOfAttendees });
        event.attendees.push({ user: user._id, numberOfAttendees });
      }

      await user.save();
      await event.save();

    res.json({ message: "Event has been Booked Successfully" });
    } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { createEvent, showInterest, getAllEvents };
