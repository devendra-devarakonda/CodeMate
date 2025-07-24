import * as userModelService from "../services/user.sevice.js";
import model from "../models/user.model.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";
import { verifyOtp } from "../services/otp.service.js";

// Create User (Register)
export const createUser = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { email, password, otp } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const userExists = await model.findOne({ email });
    if (userExists) return res.status(409).json({ message: "Email already registered" });

    try {
        // Step 1: Verify OTP before creating account
        await verifyOtp(email, otp);

        // Step 2: Create user
        const user = await userModelService.createuser({ email, password });

        // Step 3: Generate token
        const token = user.JWt();

        return res.status(201).json({ user, token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Login
export const loginUser = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {
        const user = await model.findOne({ email: req.body.email }).select("+password");

        if (!user) {
            return res.status(404).json({ message: "Email or Password is Incorrect" });
        }


        const isValid = await user.validPassword(req.body.password);

        if (!isValid) {
            return res.status(401).json({ message: "Email or Password is Incorrect" });
        }

        const token = user.JWt();
        console.log("User Login Successful");

        return res.status(200).json({ user, token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Forgot Password (with OTP)
export const forgotPassword = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { email, newPassword, otp } = req.body;

    if (!email || !newPassword || !otp) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        // Step 1: Verify OTP
        await verifyOtp(email, otp);

        // Step 2: Hash new password
        const hashedPassword = await model.hashPassword(newPassword);

        // Step 3: Update password in DB
        const user = await model.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await model.findById(req.user.id_no).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Logout
export const logoutController = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized Access" });
    }

    try {
        redisClient.set(token, "logout", "EX", 60 * 60 * 24, (err) => {
            if (err) {
                console.error("Error setting value in Redis:", err);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });

        return res.status(200).json({ message: "Logout Successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
