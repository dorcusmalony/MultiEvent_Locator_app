const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Register a user
router.post('/register', userController.register);

// Login a user
router.post('/login', userController.login);

// Logout a user
router.post('/logout', userController.logout);

// Update user details
router.put('/:id', userController.updateUser);

// Get user details by ID
router.get('/:id', userController.getUser);

module.exports = router;
