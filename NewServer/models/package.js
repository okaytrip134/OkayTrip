const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  images: [{ type: String, required: true }], // Array of image paths
  title: { type: String, required: true },
  description: { type: String, required: true },
  realPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  duration: { type: String, required: true }, // "5 days & 4 nights"
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  totalSeats: { type: Number, required: true }, // Fixed, never decreases
  availableSeats: { type: Number, required: true }, // Decreases on booking
  inclusions: [{ type: String }], // Array of inclusions
  exclusions: [{ type: String }], // Array of exclusions
  tripHighlights: [{ type: String }], // Array of trip highlights
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  slug: { type: String, unique: true },
  itinerary: [
    {
      day: { type: String, required: true }, // Auto-generated day number
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Package", packageSchema);
