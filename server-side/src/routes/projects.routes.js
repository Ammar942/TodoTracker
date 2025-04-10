const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const projectController = require("../controllers/projects.controller");
router.route("/").get(verifyToken, projectController.getUserProjects);

router.route("/add-project").post(verifyToken, projectController.addProject);
router
  .route("/:projectId")
  .get(verifyToken, projectController.getProjectDetails)
  .delete(verifyToken, projectController.deleteProject);
module.exports = router;
