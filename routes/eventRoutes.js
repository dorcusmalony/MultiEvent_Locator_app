const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Create an event
router.post('/events', eventController.createEvent);

// Get all events
router.get('/events', eventController.getAllEvents);

// Get a single event by ID
router.get('/events/:id', eventController.getEventById);

// Search events by location
router.get('/events/search', eventController.searchEventsByLocation);

// Update an event
router.put('/events/:id', eventController.updateEvent);

// Delete an event
router.delete('/events/:id', eventController.deleteEvent);

module.exports = router;
