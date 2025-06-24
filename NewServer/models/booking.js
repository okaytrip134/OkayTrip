const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
  bookingId: { type: String, unique: true, required: true },
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentType: { type: String, enum: ["full", "partial", "advance"], required: true },
  seatsBooked: { type: Number, required: true }, // ✅ Store number of seats booked
  paymentMethod: { type: String }, // like upi, card, wallet, etc.
  travelers: [
    {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, required: true },
      aadhar: { type: String, required: true }
    }
  ], // ✅ Store traveler details
  status: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);