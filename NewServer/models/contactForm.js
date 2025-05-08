const mongoose = require("mongoose");

const ContactFormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Pending", "Success", "Not Interested", "No Response"], 
      default: "Pending" 
    },
    remark: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactForm", ContactFormSchema);
