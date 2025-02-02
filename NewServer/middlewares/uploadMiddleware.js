const multer = require("multer");
const path = require("path");

// Storage configuration for uploaded SVG files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/svg/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

// File filter to allow only SVG files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/svg+xml") {
    cb(null, true);
  } else {
    cb(new Error("Only SVG files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
