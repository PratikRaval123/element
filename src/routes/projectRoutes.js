const express = require("express");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.route("/")
  .get(getProjects)
  .post(upload.single('image'), createProject);

router.route("/:id")
  .get(getProjectById)
  .put(upload.single('image'), updateProject)
  .delete(deleteProject);

module.exports = router;


