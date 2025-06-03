const Package = require("../models/package");
const Booking = require("../models/booking");
const Package = require("../models/package");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const slugify = require("slugify");

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
      metaTitle,
      metaDescription,
      metaKeywords,
      slug
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required." });
    }

    let parsedItinerary = Array.isArray(itinerary) ? itinerary : JSON.parse(itinerary);
    const formattedItinerary = parsedItinerary.map((item, index) => ({
      day: `Day ${index + 1}`,
      title: item.title,
      description: item.description,
    }));

    const images = [];
    for (const file of req.files) {
      const filename = `optimized-${Date.now()}-${file.originalname}`;
      const optimizedPath = path.join("uploads", "packages", filename);

      await sharp(file.path)
        .resize({ width: 800 })
        .jpeg({ quality: 70 })
        .toFile(optimizedPath);

      images.push(`/${optimizedPath.replace(/\\/g, "/")}`);

      // delete original upload
      fs.unlink(file.path, (err) => {
        if (err) console.error(`Error deleting original file: ${file.path}`, err);
      });
    }
    const generatedSlug = slug || slugify(title, { lower: true, strict: true });

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
      availableSeats: totalSeats,
      inclusions: Array.isArray(inclusions) ? inclusions : JSON.parse(inclusions),
      exclusions: Array.isArray(exclusions) ? exclusions : JSON.parse(exclusions),
      tripHighlights: Array.isArray(tripHighlights) ? tripHighlights : JSON.parse(tripHighlights),
      itinerary: formattedItinerary,
      metaTitle,
      metaDescription,
      metaKeywords,
      slug: generatedSlug,
    });

    await newPackage.save();
    res.status(201).json({ message: "Package created successfully!", package: newPackage });
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getAllPackages = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;

  try {
    const skip = (page - 1) * limit;
    const totalPackages = await Package.countDocuments();

    const packages = await Package.find()
      .populate("categoryId", "name")
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({ packages, totalPackages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getPackagesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const packages = await Package.find({ categoryId })
      .populate("categoryId", "name");
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages by category:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

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
      metaTitle,
      metaDescription,
      metaKeywords,
      slug,
    } = req.body;

    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res.status(404).json({ message: "Package not found." });
    }

    let parsedItinerary = Array.isArray(itinerary) ? itinerary : JSON.parse(itinerary);
    const formattedItinerary = parsedItinerary.map((item, index) => ({
      day: `Day ${index + 1}`,
      title: item.title,
      description: item.description,
    }));

    if (totalSeats) {
      packageData.totalSeats = totalSeats;
      if (packageData.availableSeats === 0) {
        packageData.availableSeats = totalSeats;
      } else if (packageData.availableSeats > totalSeats) {
        packageData.availableSeats = totalSeats;
      }
    }

    // Update fields - don't use || operator as it prevents clearing fields
    packageData.categoryId = categoryId !== undefined ? categoryId : packageData.categoryId;
    packageData.title = title !== undefined ? title : packageData.title;
    packageData.description = description !== undefined ? description : packageData.description;
    packageData.realPrice = realPrice !== undefined ? realPrice : packageData.realPrice;
    packageData.discountedPrice = discountedPrice !== undefined ? discountedPrice : packageData.discountedPrice;
    packageData.duration = duration !== undefined ? duration : packageData.duration;
    const cleanedStartDate = startDate === "null" ? null : startDate;
    const cleanedEndDate = endDate === "null" ? null : endDate;
    packageData.startDate = cleanedStartDate !== undefined ? cleanedStartDate : packageData.startDate;
    packageData.endDate = cleanedEndDate !== undefined ? cleanedEndDate : packageData.endDate;
    packageData.inclusions = inclusions !== undefined ? (Array.isArray(inclusions) ? inclusions : JSON.parse(inclusions)) : packageData.inclusions;
    packageData.exclusions = exclusions !== undefined ? (Array.isArray(exclusions) ? exclusions : JSON.parse(exclusions)) : packageData.exclusions;
    packageData.tripHighlights = tripHighlights !== undefined ? (Array.isArray(tripHighlights) ? tripHighlights : JSON.parse(tripHighlights)) : packageData.tripHighlights;
    packageData.itinerary = formattedItinerary;
    packageData.metaTitle = metaTitle !== undefined ? metaTitle : packageData.metaTitle;
    packageData.metaDescription = metaDescription !== undefined ? metaDescription : packageData.metaDescription;
    packageData.metaKeywords = metaKeywords !== undefined ? metaKeywords : packageData.metaKeywords;
    packageData.slug = slug || slugify(title, { lower: true, strict: true }) || packageData.slug;

    if (req.files && req.files.length > 0) {
      const newImages = [];

      for (const file of req.files) {
        const filename = `optimized-${Date.now()}-${file.originalname}`;
        const optimizedPath = path.join("uploads", "packages", filename);

        await sharp(file.path)
          .resize({ width: 800 })
          .jpeg({ quality: 70 })
          .toFile(optimizedPath);

        newImages.push(`/${optimizedPath.replace(/\\/g, "/")}`);

        fs.unlink(file.path, (err) => {
          if (err) console.error(`Error deleting original file: ${file.path}`, err);
        });
      }

      // Optional: Delete old images
      packageData.images.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "../../", imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlink(fullPath, (err) => {
            if (err) console.error(`Error deleting old image: ${fullPath}`, err);
          });
        }
      });

      packageData.images = newImages;
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

// Delete a package along with its images
exports.deletePackage = async (req, res) => {
  const { packageId } = req.params;

  try {
    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res.status(404).json({ message: "Package not found." });
    }

    packageData.images.forEach((imagePath) => {
      const fullPath = path.join(__dirname, `../../${imagePath}`);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath); // Remove the file
          console.log(`Deleted: ${fullPath}`);
        } catch (err) {
          console.error(`Error deleting file: ${fullPath}`, err);
        }
      }
    });

    await Package.findByIdAndDelete(packageId);

    res.status(200).json({ message: "Package and associated images deleted successfully!" });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
// Search packages with filters (duration, price range)
exports.searchPackages = async (req, res) => {
  try {
    const { duration, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const query = {};

    // Parse duration filter (e.g., "2 to 3 Days")
    if (duration) {
      const durationMatch = duration.match(/(\d+)\s*to\s*(\d+)/);
      if (durationMatch) {
        const [_, minDays, maxDays] = durationMatch;
        query.duration = { $gte: parseInt(minDays), $lte: parseInt(maxDays) };
      } else if (duration.includes('+')) {
        // Handle "5+ Days" format
        const minDays = parseInt(duration);
        query.duration = { $gte: minDays };
      } else {
        // Exact match (e.g. "2 Days")
        query.duration = duration;
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.discountedPrice = {};
      if (minPrice) query.discountedPrice.$gte = parseInt(minPrice);
      if (maxPrice) query.discountedPrice.$lte = parseInt(maxPrice);
    }

    // Only show active packages
    query.isActive = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const packages = await Package.find(query)
      .populate("categoryId", "name")
      .skip(skip)
      .limit(parseInt(limit));

    const totalPackages = await Package.countDocuments(query);

    res.status(200).json({
      packages,
      totalPackages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPackages / parseInt(limit))
    });
  } catch (error) {
    console.error("Error searching packages:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
// Add this to your packageController.js
exports.getAdminPackages = async (req, res) => {
  try {
    const packages = await Package.find({}, '_id title discountedPrice');
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Error fetching packages' });
  }
};
exports.getPackageBySlug = async (req, res) => {
  try {
    const data = await Package.findOne({ slug: req.params.slug });
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
