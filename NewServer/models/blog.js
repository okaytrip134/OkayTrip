const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true }, // ✅ New slug field
  content: { type: String, required: true },
  image: { type: String },
  tags: [{ type: String }],
  status: { type: String, enum: ["Draft", "Published"], default: "Draft" },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
}, { timestamps: true });

// ✅ Automatically generate slug from title
blogSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
