const express = require("express");
const router = express.Router();
const {
  createPackage,
  getAllPackages,
  getPackagesByCategory,
  getPackageById,
  updatePackage,
  togglePackageStatus,
  updatePackageSeats
} = require("../../controllers/packageController");
const adminAuth = require("../../middlewares/adminAuth");
const multer = require("multer");

// Multer setup for package image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/packages/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage });

// Admin routes
router.post("/create", adminAuth, upload.array("images", 40), createPackage); // Create a new package
router.get("/", getAllPackages); // Get all packages (Explore Page)
router.get("/category/:categoryId", getPackagesByCategory); // Get packages by category
router.get("/details/:packageId", getPackageById); // Get single package details
router.put("/:packageId", adminAuth, upload.array("images", 40), updatePackage); // Update a package
router.put("/:packageId/status", adminAuth, togglePackageStatus); // Deactivate/Activate a package
router.put("/:packageId/update-seats", adminAuth, updatePackageSeats);

module.exports = router;
