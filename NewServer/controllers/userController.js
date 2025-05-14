const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, phone });
    await newUser.save();

    console.log("User Registered:", newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email/number or password" });
    }

    const expiresIn = 10 * 60 * 60;
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.status(200).json({
      token,
      expiresIn,
      user: { name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Send OTP for Password Reset
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = otp;
    user.resetTokenExpiration = Date.now() + 10 * 60 * 1000; // valid for 10 min
    await user.save();

    const transporter = nodemailer.createTransport({
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: user.email,
      subject: "Your OTP for Password Reset",
      text: `Use this OTP to reset your password: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ Verify OTP and Reset Password
exports.verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      resetToken: otp,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = password; // Let Mongoose hash this
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get User Address
exports.getUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("address");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.address || {});
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update User Address
exports.updateUserAddress = async (req, res) => {
  try {
    const { city, state, country, zip, addressLine } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.address = { city, state, country, zip, addressLine };
    await user.save();

    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
