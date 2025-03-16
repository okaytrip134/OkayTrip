const express = require("express");
const { getAllLeads, updateLead } = require("../../controllers/leadController");
const router = express.Router();

router.get("/all", getAllLeads);
router.put("/update/:id", updateLead);

module.exports = router;
