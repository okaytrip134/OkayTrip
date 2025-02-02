     const TopSaleBar = require("../models/topSaleBar");

// Add or Update Sale Bar
exports.addOrUpdateSaleBar = async (req, res) => {
    const { message, startDate, endDate, active } = req.body;

    try {
        const saleBar = await TopSaleBar.findOneAndUpdate(
            { active: true }, // Update active sale bar if exists
            { message, startDate, endDate, active },
            { upsert: true, new: true } // Create if it doesn't exist
        );
        res.status(200).json({ message: "Top Sale Bar updated successfully", saleBar });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get All Sale Bars
exports.getAllSaleBars = async (req, res) => {
    try {
        const saleBars = await TopSaleBar.find();
        res.status(200).json(saleBars);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get a Single Sale Bar by ID
exports.getSaleBarById = async (req, res) => {
    const { id } = req.params;

    try {
        const saleBar = await TopSaleBar.findById(id);
        if (!saleBar) {
            return res.status(404).json({ message: "Sale Bar not found" });
        }
        res.status(200).json(saleBar);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete Sale Bar
exports.deleteSaleBar = async (req, res) => {
    const { id } = req.params;

    try {
        const saleBar = await TopSaleBar.findByIdAndDelete(id);
        if (!saleBar) {
            return res.status(404).json({ message: "Sale Bar not found" });
        }
        res.status(200).json({ message: "Sale Bar deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getActiveSaleBar = async (req, res) => {
    try {
      console.log("Executing query for active sale bar...");
      const activeSaleBar = await TopSaleBar.findOne({ active: true }); // Correct query
      if (!activeSaleBar) {
        return res.status(404).json({ message: "No active sale bar found" });
      }
      console.log("Active Sale Bar Found:", activeSaleBar);
      res.status(200).json(activeSaleBar);
    } catch (error) {
      console.error("Error in getActiveSaleBar:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };