const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Event = require('../models/event');
const { publishMessage } = require('../utils/publisher');
const { scheduleNotification } = require('../utils/scheduler');

// Create an event
exports.createEvent = async (req, res) => {
  try {
    const { name, description, latitude, longitude, event_date, categories } = req.body;

    // Validate required fields
    if (!name || !latitude || !longitude || !event_date || !categories) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate date format
    if (isNaN(Date.parse(event_date))) {
      return res.status(400).json({ error: 'Invalid date format for event_date' });
    }

    // Format location as GeoJSON Point
    const location = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };

    const event = await Event.create({
      name,
      description,
      location,
      latitude,
      longitude,
      event_date,
      categories,
    });

    // Publish real-time notification
    await publishMessage('event_notifications', {
      eventId: event.id,
      title: name,
      categories,
    });

    // Schedule delayed notification
    const eventTimestamp = new Date(event_date).getTime();
    const notificationTimestamp = eventTimestamp - 24 * 60 * 60 * 1000; // 1 day before the event
    if (notificationTimestamp > Date.now()) {
      await scheduleNotification(event.id, { title: name, categories }, notificationTimestamp);
    }

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an event by ID
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, latitude, longitude, event_date, categories } = req.body;

    // Validate required fields
    if (!name || !latitude || !longitude || !event_date || !categories) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const location = { type: 'Point', coordinates: [longitude, latitude] };
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    await event.update({ name, description, location, latitude, longitude, event_date, categories });
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    await event.destroy();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search events by location and radius
exports.searchEventsByLocation = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;

    // Validate required query parameters
    if (!latitude || !longitude || !radius) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const events = await Event.findAll({
      where: sequelize.where(
        sequelize.fn(
          'ST_DWithin',
          sequelize.col('location'),
          sequelize.fn('ST_SetSRID', sequelize.fn('ST_MakePoint', longitude, latitude), 4326),
          radius
        ),
        true
      ),
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Filter events by category
exports.filterEventsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    // Validate required query parameter
    if (!category) {
      return res.status(400).json({ error: 'Missing required query parameter: category' });
    }

    const events = await Event.findAll({
      where: {
        categories: {
          [Op.iLike]: `%${category}%`,
        },
      },
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};