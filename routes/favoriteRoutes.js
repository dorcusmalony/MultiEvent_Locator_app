const express = require('express');
const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

// Add an event to favorites
router.post('/', favoriteController.addFavorite);

// Get favorite events for a user
router.get('/:user_id', favoriteController.getFavorites);

// Remove an event from favorites
router.delete('/:id', favoriteController.removeFavorite);

module.exports = router;
