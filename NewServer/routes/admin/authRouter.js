const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../../models/admin");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

// Admin Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Include role in the JWT payload
    const token = jwt.sign(
      { id: admin._id, role: "admin" }, // Explicitly include role
      JWT_SECRET,
      { expiresIn: "10h" }
    );
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful. Clear the token on the client side." });
});
module.exports = router;

