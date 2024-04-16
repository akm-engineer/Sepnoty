// controllers/userController.js
const User = require("../models/User");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const { validate } = require("../utils/validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = "sdfjkhsdfjhfkhd47r4hgufdjk";

// 1. User registration functionality
exports.register = async (req, res) => {
  try {
    validate(req, res); // Run validation middleware
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2. User login functionality
exports.login = async (req, res) => {
  try {
    validate(req, res); // Run validation middleware
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. View all available rooms
exports.viewRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 4. Book a room
exports.bookRoom = async (req, res) => {
  try {
    validate(req, res); // Run validation middleware
    const { roomId, userId, numberOfPersons } = req.body;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    // Check if room is available for the requested date and time
    const alreadyBooked = room.bookedSlots.some(
      (slot) => slot.getTime() === room.date.getTime()
    );
    if (alreadyBooked) {
      return res
        .status(400)
        .json({ message: "Room is already booked for this slot" });
    }
    // Check if room has enough capacity
    if (numberOfPersons > room.capacity) {
      return res.status(400).json({ message: "Room capacity exceeded" });
    }
    // Book the room
    const booking = new Booking({ roomId, userId, numberOfPersons });
    await booking.save();
    // Update bookedSlots for the room
    room.bookedSlots.push(room.date);
    await room.save();
    res.status(201).json({ message: "Room booked successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 5. View booking details for the user
exports.viewBookings = async (req, res) => {
  const userId = req.params.userId;
  try {
    const bookings = await Booking.find({ userId }).populate("roomId");
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
