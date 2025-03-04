const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String, // Store user's name directly
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    adminResponse: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
