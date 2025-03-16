const Lead = require("../models/leads");
const Package = require("../models/package"); // Import Package Model
const nodemailer = require("nodemailer");
require("dotenv").config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// 🟢 Configure Nodemailer for Email Sending
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// ✅ Submit a New Enquiry
exports.submitLead = async (req, res) => {
    try {
        const { packageId, fullName, email, phone, travelDate, travellerCount, message } = req.body;

        if (!fullName || !email || !phone || !travelDate || !travellerCount || !packageId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // 🟢 Fetch Package Title
        const packageData = await Package.findById(packageId);
        if (!packageData) {
            return res.status(404).json({ error: "Package not found." });
        }

        const newLead = new Lead({
            packageId,
            packageTitle: packageData.title, // Store package title
            fullName,
            email,
            phone,
            travelDate,
            travellerCount,
            message,
        });

        await newLead.save();

        // 🟢 Send Email Notification to Admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: ADMIN_EMAIL,
            subject: `New Enquiry for ${packageData.title}`,
            html: `
        <h2>New Enquiry Received</h2>
        <p><b>Package:</b> ${packageData.title}</p>
        <p><b>Package ID:</b> ${packageId}</p>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Travel Date:</b> ${new Date(travelDate).toDateString()}</p>
        <p><b>Traveller Count:</b> ${travellerCount}</p>
        <p><b>Message:</b> ${message || "No message provided"}</p>
      `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("🛑 Email Sending Failed:", error);
            } else {
                console.log("✅ Email Sent Successfully:", info.response);
            }
        });

        res.status(201).json({ message: "Enquiry submitted successfully!" });

    } catch (error) {
        console.error("🛑 Error submitting enquiry:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
// Get all leads
exports.getAllLeads = async (req, res) => {
    try {
      const leads = await Lead.find().sort({ createdAt: -1 });
      res.status(200).json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  // Update lead status & remarks
  exports.updateLead = async (req, res) => {
    const { id } = req.params;
    const { status, remarks } = req.body;
  
    try {
      const updatedLead = await Lead.findByIdAndUpdate(
        id,
        { status, remarks },
        { new: true }
      );
  
      if (!updatedLead) {
        return res.status(404).json({ error: "Lead not found" });
      }
  
      res.status(200).json({ message: "Lead updated successfully", lead: updatedLead });
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  