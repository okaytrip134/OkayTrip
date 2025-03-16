const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
  packageTitle: { type: String, required: true }, // 🟢 Storing package title
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  travelDate: { type: Date, required: true },
  travellerCount: { type: Number, required: true },
  message: { type: String },
  status: { type: String, enum: ["Pending", "Contacted", "Closed"], default: "Pending" }, // ✅ Status field
  remarks: { type: String, default: "" }, // ✅ Remarks field
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Lead", LeadSchema);
