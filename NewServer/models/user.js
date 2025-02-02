const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for Google users
  googleId: { type: String, required: false }, // For Google OAuth
  phone: { type: String, required: false },
  address: {
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: String },
    addressLine: { type: String },
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
