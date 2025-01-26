const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.getAllUsers);
router.get("/:user_name", userController.getUser);
router.patch("/:user_name", userController.updateUser);

module.exports = router;
