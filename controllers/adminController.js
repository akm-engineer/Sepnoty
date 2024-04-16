// controllers/adminController.js
const Admin = require("../models/Admin");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validate } = require("../utils/validator");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "sdfjkhsdfjhfkhd47r4hgufdjk";

// 1. Admin login functionality
exports.login = async (req, res) => {
  try {
    validate(req, res); // Run validation middleware
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate token
    const token = jwt.sign({ userId: admin._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Add room functionality
exports.addRoom = async (req, res) => {
  try {
    const { date, time, description } = req.body;
    const room = new Room({ date, time, description });
    await room.save();
    res.status(201).json({ message: "Room added successfully", room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. View all bookings done by users
exports.viewBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 4. View total rooms, number of bookings done, and available rooms
exports.viewStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const availableRooms = totalRooms - totalBookings;
    res.status(200).json({ totalRooms, totalBookings, availableRooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 5. Show list of users signed up to admin
exports.viewUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
