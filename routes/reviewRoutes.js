const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// Add a review
router.post('/', reviewController.addReview);

// Get reviews for an event
router.get('/:event_id', reviewController.getReviews);

// Update a review
router.put('/:id', reviewController.updateReview);

module.exports = router;
