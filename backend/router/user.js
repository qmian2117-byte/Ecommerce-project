const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const {
  getusers,
  getUserid,
  userupdate,
  logininUser,
  userdel,
  signupUser,
  requestPasswordReset,
  resetPassword,
} = require("../controller/users");

const { authcheck, checkadmin } = require("./middleware/auth");

// Public routes
router.post("/login", logininUser);
router.post("/register", signupUser);
router.post("/requestpasswordreset", requestPasswordReset);
router.post("/resetpassword", resetPassword);

// Protected routes
router.get("/", authcheck, checkadmin, getusers);
router.get("/:id", authcheck, getUserid);
router.put("/:id", authcheck, userupdate);
router.delete("/:id", authcheck, userdel);

module.exports = router;
