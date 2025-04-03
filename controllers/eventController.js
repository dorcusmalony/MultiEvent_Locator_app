const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Event = require('../models/event');

exports.createEvent = async (req, res) => {
    try {
        const { name, description, latitude, longitude, event_date, categories } = req.body;

        // Validate required fields
        if (!name || !latitude || !longitude || !event_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure categories is provided, otherwise return an error
        if (!categories) {
            return res.status(400).json({ error: 'Categories field is required' });
        }

        // Create the event with location
        const event = await Event.create({
            name,
            description,
            latitude,
            longitude,
            event_date,
            categories,
            location: sequelize.literal(`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`),
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const { category } = req.query;

        // Build the query conditionally based on the category filter
        const whereClause = category ? { categories: category } : {};

        const events = await Event.findAll({ where: whereClause });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id, 10); // Convert ID to a number
        const event = await Event.findByPk(eventId);
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
        const eventId = parseInt(req.params.id, 10); // Convert ID to a number
        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Update the event
        await event.update({
            name,
            description,
            latitude,
            longitude,
            event_date,
            categories: categories || event.categories, // Retain existing categories if not provided
        });

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id, 10); // Convert ID to a number
        const event = await Event.findByPk(eventId);
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

        // Validate required query parameters
        if (!latitude || !longitude || !radius) {
            return res.status(400).json({ error: 'Latitude, longitude, and radius are required' });
        }

        // Query the database for events within the specified radius
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
                type: sequelize.QueryTypes.SELECT,
                replacements: { latitude: parseFloat(latitude), longitude: parseFloat(longitude), radius: parseFloat(radius) },
            }
        );

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
