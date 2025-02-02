const express = require("express");
const router = express.Router();
const { sendUserQuery } = require("../../controllers/contactController");
const authMiddleware = require("../../middlewares/authMiddleware");

// POST route for sending user query
router.post("/send-query", authMiddleware, sendUserQuery);

module.exports = router;
