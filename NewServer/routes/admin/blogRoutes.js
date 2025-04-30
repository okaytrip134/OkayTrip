const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  getBlogsAdmin,
  getBlogById,
  getBlogBySlug,
} = require("../../controllers/blogController");
const adminAuth = require("../../middlewares/adminAuth");
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }, 
});

const upload = multer({ storage });

router.post(
  "/upload-image",
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image uploaded" });
      }

      res.status(200).json({
        success: true,
        url: `/uploads/blogs/${req.file.filename}`,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Upload error" });
    }
  }
);
router.post("/", adminAuth, createBlog);

router.get("/", getBlogs);
router.get("/admin", adminAuth, getBlogsAdmin);
router.get("/slug/:slug", getBlogBySlug);
router.get("/:id", getBlogById);
router.put("/:id", adminAuth, updateBlog);
router.delete("/:id", adminAuth, deleteBlog);

module.exports = router;
