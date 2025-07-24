// ✅ UPDATED: user.routes.js
import { Router } from "express";
import * as authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();

import * as userController from "../Controllers/user.controller.js";
import { body } from "express-validator";

import * as otpService from "../services/otp.service.js";
import userModel from "../models/user.model.js";


// ✅ Register (after OTP verification)
router.post(
  "/register",
  body("email").isEmail().withMessage("Please enter a valid email addresss"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  userController.createUser
);

// ✅ Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email addresss"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  ],
  userController.loginUser
  
);

// ✅ Profile & Logout
router.get("/profile", authMiddleware.auth, userController.getUserProfile);
router.get("/logout", authMiddleware.auth, userController.logoutController);

// ✅ Send OTP to Email
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email is already registered" });

    await otpService.sendOtpToEmail(email);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ✅ Verify OTP (for testing/debug UI step, doesn't delete OTP)
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    await otpService.verifyOtp(email, otp); // ✅ Do NOT delete here, just check
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// ✅ Forgot Password (with OTP)
router.post(
  "/forgot-password",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("newPassword").isLength({ min: 8 }).withMessage("Minimum 8 characters"),
    body("otp").isLength({ min: 6 }).withMessage("OTP is required")
  ],
  userController.forgotPassword
);




// Send OTP for forgot-password (even if user already exists)
router.post("/send-otp-forgot", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await otpService.sendOtpToEmail(email);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;



 









