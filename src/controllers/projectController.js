const Project = require("../models/project");
const asyncHandler = require("../utils/asyncHandler");

exports.getProjects = asyncHandler(async (_req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

exports.getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.json(project);
});

exports.createProject = asyncHandler(async (req, res) => {
  if (req.file) {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    req.body.imageUrl = fileUrl;
  }

  const project = await Project.create(req.body);
  res.status(201).json(project);
});

exports.updateProject = asyncHandler(async (req, res) => {
  if (req.file) {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    req.body.imageUrl = fileUrl;
  }

  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.json(project);
});

exports.deleteProject = asyncHandler(async (req, res) => {
  const deleted = await Project.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.status(204).end();
});


