// models/Room.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  description: { type: String },
  capacity: { type: Number, default: 2 }, // Maximum capacity of the room
  bookedSlots: [{ type: Date }], // Slots already booked for this room
});

module.exports = mongoose.model("Room", roomSchema);
