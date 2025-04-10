const express = require("express");
const router = express.Router();
const registerationController = require("../controllers/registeration.controller");
router.post("/signup", registerationController.signup);

router.post("/login", registerationController.login);
router.get("/logout", registerationController.logout);
module.exports = router;
