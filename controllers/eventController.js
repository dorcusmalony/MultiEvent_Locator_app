const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Event = require('../models/event');

exports.createEvent = async (req, res) => {
    try {
        const { name, description, latitude, longitude, event_date, categories } = req.body;

        // Validate required fields
        if (!name || !latitude || !longitude || !event_date || !categories) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create the event
        const event = await Event.create({ name, description, latitude, longitude, event_date, categories });
        res.status(201).json(event);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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

exports.updateEvent = async (req, res) => {
    try {
        const { name, description, latitude, longitude, event_date, categories } = req.body;
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        await event.update({ name, description, latitude, longitude, event_date, categories });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        await event.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchEventsByLocation = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;

        if (!latitude || !longitude || !radius) {
            return res.status(400).json({ error: 'Latitude, longitude, and radius are required' });
        }

        const events = await sequelize.query(
            `
            SELECT * FROM events
            WHERE ST_DWithin(
                ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
                ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
                :radius
            )
            `,
            {
                replacements: { latitude, longitude, radius },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
