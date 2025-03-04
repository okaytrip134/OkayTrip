const express = require("express");
const multer = require("multer"); // ✅ Import multer
const path = require("path"); // ✅ Import path module
const { addReview, getPackageReviews, getPackageRating } = require("../../controllers/reviewController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// ✅ Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/reviews/"); // Store in uploads/reviews folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// ✅ Route to submit review (with images)
router.post("/add", authMiddleware, upload.array("images", 30), addReview); // Allow up to 5 images
router.get("/:packageId", getPackageReviews); // Get all reviews for a package
router.get("/:packageId/rating", getPackageRating); // Get average rating of a package

module.exports = router;
