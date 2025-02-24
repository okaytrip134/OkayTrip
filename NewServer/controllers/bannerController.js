const fs = require("fs");
const path = require("path");
const Banner = require("../models/banner");

// Get Banner
exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne();
    res.status(200).json({ banner });
  } catch (error) {
    console.error("Error fetching banner:", error);
    res.status(500).json({ message: "Failed to fetch banner" });
  }
};

// Update Banner
exports.updateBanner = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/banners/${req.file.filename}` : undefined;

    let banner = await Banner.findOne();

    if (!banner) {
      banner = new Banner({ imageUrl });
    } else {
      // Delete old image if a new one is uploaded
      if (imageUrl && banner.imageUrl) {
        const oldImagePath = path.join(__dirname, "..", banner.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      if (imageUrl) banner.imageUrl = imageUrl;
    }

    await banner.save();
    res.status(200).json({ message: "Banner updated successfully", banner });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: "Failed to update banner" });
  }
};
