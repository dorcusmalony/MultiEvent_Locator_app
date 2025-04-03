const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

// Register a user
router.post("/register", userController.register); // Ensure this route exists

// Updated routes
router.post("/login", userController.login); // Ensure this route exists
router.put("/:id", userController.updateUser);

module.exports = router;
