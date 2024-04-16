const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { loginValidation } = require("../utils/validator");

// Admin login route
router.post("/login", loginValidation, adminController.login);

// Add room route
router.post("/addRoom", adminController.addRoom);

// View all bookings route
router.get("/bookings", adminController.viewBookings);

// View stats route
router.get("/stats", adminController.viewStats);

// View users route
router.get("/users", adminController.viewUsers);

module.exports = router;
