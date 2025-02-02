const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
  bookingId: { type: String, unique: true, required: true },
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentType: { type: String, enum: ["full", "partial", "advance"], required: true },
  status: { type: String, default: "Confirmed" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
