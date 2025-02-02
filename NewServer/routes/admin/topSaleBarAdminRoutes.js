const express = require("express");
const router = express.Router();
const {
  addOrUpdateSaleBar,
  getAllSaleBars,
  getSaleBarById,
  getActiveSaleBar,
  deleteSaleBar,
} = require("../../controllers/topSaleBarController");

// Active Sale Bar - Place this route BEFORE the dynamic ":id" route
router.get("/active", getActiveSaleBar);

// Add or update sale bar
router.post("/add-or-update", addOrUpdateSaleBar);

// Get all sale bars
router.get("/", getAllSaleBars);

// Get a single sale bar by ID
router.get("/:id", getSaleBarById);

// Delete sale bar
router.delete("/:id", deleteSaleBar);

module.exports = router;
