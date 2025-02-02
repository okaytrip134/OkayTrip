const path = require("path");
const fs = require("fs");
const Category = require("../models/category");

// Create a new category
exports.createCategory = async (req, res) => {
  const { name, isTrending } = req.body;

  if (!req.file || !name) {
    return res.status(400).json({ message: "Name and SVG file are required." });
  }

  try {
    const category = new Category({
      name,
      svgPath: `/uploads/svg/${req.file.filename}`, // Save relative path
      isTrending: isTrending === "true",
      isActive: true, // Default category status to active
    });

    await category.save();
    res.status(201).json({ message: "Category created successfully!" });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Failed to create category." });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  const isAdmin = req.query.isAdmin === "true"; // Check if the request is from admin
  try {
    const categories = isAdmin
      ? await Category.find() // Admin sees all categories
      : await Category.find({ isActive: true }); // Website sees only active categories
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Toggle active/inactive status of a category
exports.toggleCategoryStatus = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
  
    try {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      category.isActive = isActive;
      await category.save();
      res.status(200).json({ message: "Category status updated successfully!" });
    } catch (error) {
      console.error("Error updating category status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Toggle trending status of a category
  exports.toggleTrendingStatus = async (req, res) => {
    const { id } = req.params;
    const { isTrending } = req.body;
  
    try {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      category.isTrending = isTrending;
      await category.save();
      res.status(200).json({ message: "Category trending status updated successfully!" });
    } catch (error) {
      console.error("Error updating trending status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };