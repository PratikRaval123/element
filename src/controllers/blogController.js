const BlogPost = require("../models/blogPost");
const asyncHandler = require("../utils/asyncHandler");

exports.getBlogs = asyncHandler(async (_req, res) => {
  const posts = await BlogPost.find().sort({ createdAt: -1 });
  res.json(posts);
});

exports.getBlogById = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Blog post not found" });
  }
  res.json(post);
});

exports.createBlog = asyncHandler(async (req, res) => {
  if (req.file) {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    req.body.imageUrl = fileUrl;
  }

  const post = await BlogPost.create(req.body);
  res.status(201).json(post);
});

exports.updateBlog = asyncHandler(async (req, res) => {
  if (req.file) {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    req.body.imageUrl = fileUrl;
  }

  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    return res.status(404).json({ message: "Blog post not found" });
  }
  res.json(post);
});

exports.deleteBlog = asyncHandler(async (req, res) => {
  const deleted = await BlogPost.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Blog post not found" });
  }
  res.status(204).end();
});


