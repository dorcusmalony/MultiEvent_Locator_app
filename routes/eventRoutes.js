const express = require('express');
const eventController = require('../controllers/eventController');

const router = express.Router();

// Create an event
router.post('/', eventController.createEvent);

// Get all events
router.get('/', eventController.getAllEvents);

// Get an event by ID
router.get('/:id', eventController.getEventById);

// Update an event by ID
router.put('/:id', eventController.updateEvent);

// Delete an event by ID
router.delete('/:id', eventController.deleteEvent);

// Search events by location and radius
router.get('/search/location', eventController.searchEventsByLocation);

// Filter events by category
router.get('/search/category', eventController.filterEventsByCategory);

module.exports = router;
