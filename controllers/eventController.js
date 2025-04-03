const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Event = require('../models/event');

// Create an event
exports.createEvent = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body for debugging
    const { name, description, latitude, longitude, event_date, categories } = req.body;

    // Validate required fields
    if (!name || !latitude || !longitude || !event_date || !categories) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const location = { type: 'Point', coordinates: [longitude, latitude] };
    const event = await Event.create({ name, description, location, latitude, longitude, event_date, categories });
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const events = await Event.findAll({
      where: sequelize.where(
        sequelize.fn(
          'ST_DWithin',
          sequelize.col('location'),
          sequelize.fn('ST_MakePoint', longitude, latitude),
          radius
        ),
        true
      ),
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Filter events by category
exports.filterEventsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const events = await Event.findAll({
      where: {
        categories: {
          [Op.iLike]: `%${category}%`,
        },
      },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};