const mongoose = require("mongoose"); // ✅ Add this line
const multer = require("multer"); // ✅ Import multer for file uploads
const Review = require("../models/review");
const Package = require("../models/package");
const User = require("../models/user");
const { ObjectId } = mongoose.Types; // Import ObjectId
const path = require("path");

// ✅ Configure multer storage for reviews
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/reviews/"); // Store in uploads/reviews folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// ✅ Multer upload middleware (multiple images allowed)
const upload = multer({ storage });

// ✅ Add a new review with image uploads
exports.addReview = async (req, res) => {
  try {
    const { packageId, rating, reviewText } = req.body;
    const userId = req.user.id;

    // Check if package exists
    const packageExists = await Package.findById(packageId);
    if (!packageExists) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Save image paths
    const images = req.files ? req.files.map(file => "/uploads/reviews/" + file.filename) : [];

    // Save the review
    const newReview = new Review({
      userId,
      userName: user.name,
      packageId,
      rating,
      reviewText,
      images, // Save uploaded image paths
    });

    await newReview.save();

    res.status(201).json({ success: true, message: "Review submitted successfully", review: newReview });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ success: false, message: "Failed to submit review" });
  }
};
// ✅ Get all reviews for a specific package
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};
exports.getPackageReviews = async (req, res) => {
  try {
    const { packageId } = req.params;

    console.log("Fetching reviews for Package ID:", packageId); // 🛠 Log Package ID

    const reviews = await Review.find({ packageId })
      .populate("userId", "name email") // Include user details
      .sort({ createdAt: -1 });

    console.log("Returning Reviews:", reviews); // 🛠 Log fetched reviews

    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};


// ✅ Admin can update a review response
exports.updateAdminResponse = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { adminResponse } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { adminResponse },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Admin response updated", review });
  } catch (error) {
    console.error("Error updating admin response:", error);
    res.status(500).json({ success: false, message: "Failed to update review response" });
  }
};

// ✅ Delete a review (Admin only)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};

exports.getPackageRating = async (req, res) => {
  try {
    const { packageId } = req.params;

    // Fetch all reviews for the package
    const reviews = await Review.find({ packageId });

    if (!reviews.length) {
      return res.json({ success: true, averageRating: 0 }); // ✅ Ensure a number is returned
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    res.json({ success: true, averageRating: Number(averageRating.toFixed(1)) }); // ✅ Ensure number format
  } catch (error) {
    console.error("Error calculating average rating:", error);
    res.status(500).json({ success: false, message: "Failed to calculate rating" });
  }
};
