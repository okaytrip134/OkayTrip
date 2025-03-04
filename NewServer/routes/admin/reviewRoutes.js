const express = require("express");
const { getAllReviews, updateAdminResponse, deleteReview } = require("../../controllers/reviewController");
const authMiddleware = require("../../middlewares/authMiddleware"); // Ensure only admin can access

const router = express.Router();

// ✅ Fetch all reviews for admin panel
router.get("/all", authMiddleware, getAllReviews);

// ✅ Update admin response
router.put("/:reviewId", authMiddleware, updateAdminResponse);

// ✅ Delete review
router.delete("/:reviewId", authMiddleware, deleteReview);

module.exports = router;