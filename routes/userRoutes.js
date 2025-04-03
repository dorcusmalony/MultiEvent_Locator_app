const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

// Register a user
router.post("/register", userController.register);

// Updated routes
router.post("/login", userController.login);
router.put("/:id", userController.updateUser);

module.exports = router;
