const express = require("express");
const router = express.Router();
const {
  createPackage,
  getAllPackages,
  getPackagesByCategory,
  getPackageById,
  updatePackage,
  togglePackageStatus,
  deletePackage
} = require("../../controllers/packageController");
const adminAuth = require("../../middlewares/authMiddleware");
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
router.post("/create", adminAuth, upload.array("images", 40), createPackage);
router.get("/", getAllPackages); 
router.get("/category/:categoryId", getPackagesByCategory); 
router.get("/details/:packageId", getPackageById);
router.put("/:packageId", adminAuth, upload.array("images", 40), updatePackage);
router.put("/:packageId/status", adminAuth, togglePackageStatus); 
router.delete("/:packageId", adminAuth, deletePackage); 

module.exports = router;
