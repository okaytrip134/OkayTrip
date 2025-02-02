const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/uploadMiddleware");
const { createCategory, getCategories, toggleCategoryStatus, toggleTrendingStatus } = require("../../controllers/categoryContoller");
const adminAuth = require("../../middlewares/adminAuth");

// Create category
router.post("/create", adminAuth, upload.single("svgFile"), createCategory);

// Get all categories
router.get("/", adminAuth, getCategories);

// Toggle category status
router.put("/:id/status", adminAuth, toggleCategoryStatus);

// Toggle trending status
router.put("/:id/trending", adminAuth, toggleTrendingStatus);

module.exports = router;
