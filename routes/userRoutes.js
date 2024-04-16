const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const { loginValidation } = require("../utils/validator");

// User registration route
router.post("/register", loginValidation, userController.register);

// User login route
router.post("/login", loginValidation, userController.login);

// View all available rooms route
router.get("/rooms", userController.viewRooms);

// Book a room route
router.post("/bookRoom", userController.bookRoom);

// View booking details for the user route
router.get("/bookings/:userId", userController.viewBookings);

module.exports = router;
