const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const taskController = require("../controllers/tasks.controller");
router.route("/add-task").post(verifyToken, taskController.addTaskToProject);
router.route("/:id").delete(verifyToken, taskController.deleteTask);
router.route("/:id").patch(verifyToken, taskController.updateTask);
module.exports = router;
