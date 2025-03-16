const express = require("express");
const router = express.Router();
const { submitLead } = require("../../controllers/leadController");

// ✅ Route for Submitting a Lead
router.post("/submit", submitLead);

module.exports = router;
