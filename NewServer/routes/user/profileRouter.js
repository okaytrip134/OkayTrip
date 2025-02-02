const express = require("express");
const { getUserProfile, updateUserProfile } = require("../../controllers/userController");
const { getUserAddress, updateUserAddress } = require("../../controllers/userController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getUserProfile);
router.put("/", authMiddleware, updateUserProfile);
router.get("/address", authMiddleware, getUserAddress);
router.put("/address", authMiddleware, updateUserAddress);
module.exports = router;
