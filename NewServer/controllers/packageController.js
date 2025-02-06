const Package = require("../models/package");
const path = require("path");
const fs = require("fs");

// Create a new package
exports.createPackage = async (req, res) => {
  try {
    const {
      categoryId,
      title,
      description,
      realPrice,
      discountedPrice,
      duration,
      startDate,
      endDate,
      totalSeats,
      inclusions,
      exclusions,
      tripHighlights,
      itinerary,
    } = req.body;

    // Validate Image Upload
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required." });
    }

    // Process Itinerary
    let parsedItinerary = Array.isArray(itinerary) ? itinerary : JSON.parse(itinerary);
    const formattedItinerary = parsedItinerary.map((item, index) => ({
      day: `Day ${index + 1}`,
      title: item.title,
      description: item.description,
    }));

    // Save Image Paths
    const images = req.files.map((file) => `/uploads/packages/${file.filename}`);

    const newPackage = new Package({
      categoryId,
      images,
      title,
      description,
      realPrice,
      discountedPrice,
      duration,
      startDate,
      endDate,
      totalSeats,
      inclusions: Array.isArray(inclusions) ? inclusions : JSON.parse(inclusions),
      exclusions: Array.isArray(exclusions) ? exclusions : JSON.parse(exclusions),
      tripHighlights: Array.isArray(tripHighlights) ? tripHighlights : JSON.parse(tripHighlights),
      itinerary: formattedItinerary, // Corrected Itinerary Handling
    });

    await newPackage.save();
    res.status(201).json({ message: "Package created successfully!", package: newPackage });
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all packages (Explore Page)
exports.getAllPackages = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;

  try {
    const skip = (page - 1) * limit;
    const totalPackages = await Package.countDocuments();

    const packages = await Package.find()
      .populate("categoryId", "name") // Populate categoryId with the name field
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({ packages, totalPackages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get packages by category 
exports.getPackagesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const packages = await Package.find({ categoryId, isActive: true });
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages by category:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get a single package by ID
exports.getPackageById = async (req, res) => {
  const { packageId } = req.params;
  try {
    const packageData = await Package.findById(packageId).populate("categoryId", "name");
    if (!packageData) {
      return res.status(404).json({ message: "Package not found." });
    }
    res.status(200).json(packageData);
  } catch (error) {
    console.error("Error fetching package by ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
// Update an existing package
// Update an existing package
exports.updatePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const {
      categoryId,
      title,
      description,
      realPrice,
      discountedPrice,
      duration,
      startDate,
      endDate,
      totalSeats,
      inclusions,
      exclusions,
      tripHighlights,
      itinerary,
    } = req.body;

    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res.status(404).json({ message: "Package not found." });
    }

    // Process Itinerary
    let parsedItinerary = Array.isArray(itinerary) ? itinerary : JSON.parse(itinerary);
    const formattedItinerary = parsedItinerary.map((item, index) => ({
      day: `Day ${index + 1}`,
      title: item.title,
      description: item.description,
    }));

    // Update fields
    packageData.categoryId = categoryId || packageData.categoryId;
    packageData.title = title || packageData.title;
    packageData.description = description || packageData.description;
    packageData.realPrice = realPrice || packageData.realPrice;
    packageData.discountedPrice = discountedPrice || packageData.discountedPrice;
    packageData.duration = duration || packageData.duration;
    packageData.startDate = startDate || packageData.startDate;
    packageData.endDate = endDate || packageData.endDate;
    packageData.totalSeats = totalSeats || packageData.totalSeats;
    packageData.inclusions = inclusions ? (Array.isArray(inclusions) ? inclusions : JSON.parse(inclusions)) : packageData.inclusions;
    packageData.exclusions = exclusions ? (Array.isArray(exclusions) ? exclusions : JSON.parse(exclusions)) : packageData.exclusions;
    packageData.tripHighlights = tripHighlights ? (Array.isArray(tripHighlights) ? tripHighlights : JSON.parse(tripHighlights)) : packageData.tripHighlights;
    packageData.itinerary = formattedItinerary; // Corrected Itinerary Handling

    // Handle Image Uploads
    if (req.files && req.files.length > 0) {
      packageData.images = req.files.map((file) => `/uploads/packages/${file.filename}`);
    }

    await packageData.save();
    res.status(200).json({ message: "Package updated successfully!", package: packageData });
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


exports.togglePackageStatus = async (req, res) => {
  const { packageId } = req.params;
  const { isActive } = req.body;
  try {
    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res.status(404).json({ message: "Package not found." });
    }
    packageData.isActive = isActive;
    await packageData.save();
    res.status(200).json({ message: "Package status updated successfully!" });
  } catch (error) {
    console.error("Error toggling package status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.updatePackageSeats = async (req, res) => {
  const { packageId } = req.params;
  const { totalSeats } = req.body;

  try {
    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }

    // ✅ Admin updates seat count
    packageData.totalSeats = totalSeats;
    await packageData.save();

    res.status(200).json({ message: "Package seat count updated successfully!" });
  } catch (error) {
    console.error("Error updating package seat count:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};