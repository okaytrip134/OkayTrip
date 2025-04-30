const Blog = require("../models/blog");
const multer = require("multer");
const slugify = require("slugify");

const storage = multer.diskStorage({
  destination: "uploads/blogs/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage }).single("image");

exports.createBlog = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ success: false, message: "Image upload failed" });

    try {
      // // Add authentication check
      // if (!req.user || !req.user.id) {
      //   return res.status(401).json({ success: false, message: "Unauthorized" });
      // }

      const { title, content, tags, status, metaTitle, metaDescription, slug, metaKeywords } = req.body;
      const imageUrl = req.file ? `/uploads/blogs/${req.file.filename}` : "";

      const finalSlug = slug
        ? slugify(slug, { lower: true, strict: true })
        : slugify(title, { lower: true, strict: true });

      const existingSlug = await Blog.findOne({ slug: finalSlug });
      if (existingSlug) {
        return res.status(400).json({ success: false, message: "Slug already exists" });
      }

      const blog = new Blog({
        title,
        slug: finalSlug,
        content,
        image: imageUrl,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        status,
        metaTitle,
        metaDescription,
        metaKeywords,

      });

      await blog.save();
      res.status(201).json({ success: true, blog });
    } catch (error) {
      console.error("Create blog error:", error);
      res.status(500).json({ 
        success: false, 
        message: error.message || "Internal server error" 
      });
    }
  });
};

exports.updateBlog = (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res.status(500).json({ success: false, message: "Image upload failed" });

    try {
      const { title, content, tags, status, metaTitle, metaDescription, slug, metaKeywords } = req.body;

      let updateData = {
        title,
        content,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        status,
        metaTitle,
        metaDescription,
        metaKeywords,
      };

      if (slug) {
        const generatedSlug = slugify(slug, { lower: true, strict: true });

        const exists = await Blog.findOne({ slug: generatedSlug, _id: { $ne: req.params.id } });
        if (exists) {
          return res.status(400).json({ success: false, message: "Slug already exists" });
        }

        updateData.slug = generatedSlug;
      }

      if (req.file) {
        updateData.image = `/uploads/blogs/${req.file.filename}`;
      } else if (req.body.removeImage === "true") {
        updateData.image = "";
      }

      const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updated) return res.status(404).json({ message: "Blog not found" });

      res.status(200).json({ success: true, blog: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};

// ✅ Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate("author", "name");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all blogs for admin
exports.getBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate("author", "name");
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate("author", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
