const express = require("express");
const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.route("/")
  .get(getBlogs)
  .post(upload.single('image'), createBlog);

router.route("/:id")
  .get(getBlogById)
  .put(upload.single('image'), updateBlog)
  .delete(deleteBlog);

module.exports = router;


