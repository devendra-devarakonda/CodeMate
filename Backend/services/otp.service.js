// ✅ UPDATED: otp.service.js
import crypto from "crypto";
import redisClient from "./redis.service.js";
import { sendOTP } from "./email.service.js";

// ✅ Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP and store in Redis
export const sendOtpToEmail = async (email) => {
  const otp = generateOtp();
  console.log(`Generated OTP for ${email}: ${otp}`);

  // Store OTP for 5 minutes (300s)
  await redisClient.set(`otp:${email}`, otp, { EX: 300 });
  await sendOTP(email, otp);
};

// ✅ Verify OTP with optional delete after success
export const verifyOtp = async (email, otp, deleteOnSuccess = false) => {
  const storedOtp = await redisClient.get(`otp:${email}`);
  console.log(`Stored OTP in Redis for ${email}: ${storedOtp}`);

  if (!storedOtp || storedOtp !== otp) {
    throw new Error("Invalid or expired OTP");
  }

  if (deleteOnSuccess) {
    await redisClient.del(`otp:${email}`);
  }

  return true;
};
