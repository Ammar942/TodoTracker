const asyncWrapperMiddleware = require("../middlewares/asyncWrapper.middleware");
const Project = require("../models/project.model");
const AppError = require("../utils/appError");
const agenda = require("../utils/agenda");
const Task = require("../models/task.model");
const addTaskToProject = asyncWrapperMiddleware(async (req, res, next) => {
  const { name, priority, endDate, reminder, project } = req.body;
  const userId = req.user._id;
  const projectFounded = await Project.findOne({ name: project });
  if (!projectFounded) {
    return res.status(400).json({
      status: "fail",
      message: "A project with this name doesn't exist exists.",
    });
  }
  const reminderToMs = {
    "24h": 24 * 60 * 60 * 1000,
    "12h": 12 * 60 * 60 * 1000,
    "1h": 1 * 60 * 60 * 1000,
  };

  const task = await Task.create({
    taskName: name,
    priority,
    endDate,
    reminder,
    projectName: project,
    user: userId,
  });
  if (task.reminder) {
    const reminderTime = new Date(task.endDate - reminderToMs[task.reminder]);
    await agenda.schedule(reminderTime, "send task reminder", {
      taskId: task._id,
    });
  }
  projectFounded.tasks.push(task._id);
  await projectFounded.save();
  return res.status(201).json({
    status: "success",
    message: "task added to project successfully",
    data: task,
  });
});
const deleteTask = asyncWrapperMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return next(new AppError("Task not found", 404, "fail"));
  }
  await Project.updateOne(
    { tasks: id },
    { $pull: { tasks: id } },
    { new: true }
  );
  return res.status(200).json({
    status: "success",
    message: "task deleted successfully",
    data: null,
  });
});
const updateTask = asyncWrapperMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const task = await Task.findById(id);
  if (status === "Completed") {
    task.endTime = new Date();
    task.timeSpent = (task.endTime - new Date(task.createdAt)) / 1000;
  }
  task.status = status;
  await task.save();
  if (!task) {
    return next(new AppError("Task not found", 404, "fail"));
  }
  return res.status(200).json({
    status: "success",
    message: "task updated successfully",
    data: task,
  });
});
module.exports = {
  addTaskToProject,
  deleteTask,
  updateTask,
};
