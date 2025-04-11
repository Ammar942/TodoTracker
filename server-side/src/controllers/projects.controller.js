const asyncWrapperMiddleware = require("../middlewares/asyncWrapper.middleware");
const Project = require("../models/project.model");
const AppError = require("../utils/appError");
const Task = require("../models/task.model");
const getUserProjects = asyncWrapperMiddleware(async (req, res, next) => {
  const userId = req.user._id;
  const projects = await Project.find({ userId }).populate("tasks");
  return res.status(200).json({
    status: "success",
    message: "projects fetched successfully",
    data: projects,
  });
});
const addProject = asyncWrapperMiddleware(async (req, res, next) => {
  const { name, description, deadline } = req.body;
  const userId = req.user._id;
  const existingProject = await Project.findOne({ name, userId });
  if (existingProject) {
    return res.status(400).json({
      status: "fail",
      message: "A project with this name already exists.",
    });
  }
  const project = await Project.create({
    name,
    description,
    userId,
    deadline,
  });
  return res.status(201).json({
    status: "success",
    message: "project added successfully",
    data: project,
  });
});
const getProjectDetails = asyncWrapperMiddleware(async (req, res, next) => {
  const { projectId } = req.params;
  const userId = req.user._id;
  const project = await Project.findOne({
    _id: projectId,
    userId,
  }).populate("tasks");
  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  return res.status(200).json({
    status: "success",
    message: "project details fetched successfully",
    data: project,
  });
});
const deleteProject = asyncWrapperMiddleware(async (req, res, next) => {
  const { projectId } = req.params;
  console.log(projectId);
  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    return next(new AppError("Project not found", 404, "fail"));
  }
  await Task.deleteMany({ projectName: project.name });
  return res.status(200).json({
    status: "success",
    message: "project deleted successfully",
    data: null,
  });
});
module.exports = {
  getUserProjects,
  addProject,
  getProjectDetails,
  deleteProject,
};
