const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  images: [{ type: String, required: true }], 
  title: { type: String, required: true },
  description: { type: String, required: true },
  realPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  duration: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true }, 
  inclusions: [{ type: String }], 
  exclusions: [{ type: String }], 
  tripHighlights: [{ type: String }], 
  itinerary: [
    {
      day: { type: String, required: true }, 
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Package", packageSchema);
