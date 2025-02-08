const multer = require("multer");
const path = require("path");

// Storage configuration for banner images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/banners/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

// File filter to allow image types (jpg, jpeg, png, svg)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, .png, and .svg files are allowed"), false);
  }
};

const uploadBanner = multer({ storage, fileFilter });

module.exports = uploadBanner;
