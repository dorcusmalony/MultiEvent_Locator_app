const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

// Register a user
router.post('/register', userController.register);

// Login a user
router.post('/login', userController.login);

// Logout a user
router.post('/logout', userController.logout);

// Update user details
router.put('/:id', userController.updateUser);

module.exports = router;
