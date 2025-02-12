const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Save the user with the plain password (middleware will hash it)
    const newUser = new User({ name, email, password, phone });
    await newUser.save();

    console.log("User Registered:", newUser); // Debug log

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

    // ✅ Set expiry time for the token
    const expiresIn = 10 * 60 * 60; // 10 hours in seconds
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.status(200).json({
      token,
      expiresIn, // ✅ Send expiry time in response
      user: { name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Forget password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create a reset token (random string)
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Set expiration time for the token (1 hour)
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour

    // Update the user record with the reset token and expiration time
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    // Send the reset token to the user's email
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
      subject: "Password Reset Request",
      text: `Click the following link to reset your password: \n\n
      http://localhost:5173/reset-password/${resetToken}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ message: "Error sending email" });
      }
      res
        .status(200)
        .json({ message: "Password reset link sent to your email!" });
    });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Extract token from URL
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is missing." });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful!", success: true });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
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
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from params
    const deletedUser = await User.findByIdAndDelete(id); // Delete user by ID

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
