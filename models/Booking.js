const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookedAt: { type: Date, default: Date.now },
  numberOfPersons: { type: Number, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
