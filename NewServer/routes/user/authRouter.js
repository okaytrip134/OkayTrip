const express = require("express");
const { registerUser, loginUser, getAllUsers,forgotPassword,resetPassword } = require("../../controllers/userController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get("/all", authMiddleware, getAllUsers);

module.exports = router;
