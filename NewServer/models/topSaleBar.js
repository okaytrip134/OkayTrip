const mongoose = require("mongoose");

const topSaleBarSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TopSaleBar", topSaleBarSchema);
