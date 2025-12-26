const express = require("express");
const router = express.Router();
const {
  sendSignupOTP,
  verifySignupOTP,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/signup-otp", sendSignupOTP);
router.post("/verify-otp", verifySignupOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
