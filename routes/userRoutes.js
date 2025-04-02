const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

// Updated routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/:id", userController.updateUser);

module.exports = router;
