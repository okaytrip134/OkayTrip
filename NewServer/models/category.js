const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  svgPath: { type: String, required: true },
  isTrending: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },   
});

module.exports = mongoose.model("Category", categorySchema);
