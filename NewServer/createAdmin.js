const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/admin"); // Adjust path if needed
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const password = "Admin123"; // Your plaintext password

    // Save admin with the hashed password and explicit role
    const admin = await Admin.findOneAndUpdate(
      { email: "root@admin.com" }, // Check for existing admin
      { email: "root@admin.com", password: await bcrypt.hash(password, 10), role: "admin" }, // Include role here
      { upsert: true, new: true } // Create if doesn't exist
    );

    console.log("Admin created or updated successfully:", admin);
    mongoose.disconnect();
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

createAdmin();
