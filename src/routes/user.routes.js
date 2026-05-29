const express = require("express");
const router = express.Router();
const {
  Auth,
  isAuthenticated,
  UserController,
} = require("../controller/user.controller");

router.post("/login", Auth.login);
router.post("/logout", isAuthenticated, Auth.logout);
router.post("/register", Auth.register);
router.get("/profile/:id", isAuthenticated, UserController.getUserById);

module.exports = router;
