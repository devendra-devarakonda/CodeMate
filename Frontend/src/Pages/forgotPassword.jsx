import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import successAnimation from "../assets/animations/success.json";
import waveAnimation from "../assets/animations/wave-bg.json";

const characters = [
  "{", "}", "<", ">", "(", ")", ";", "=", "?", "&", "*",
  "A", "B", "C", "D", "E", "G", "H", "I", "K", "L", "M", "N", "O", "Q", "R", "S", "U", "V", "W", "X", "Y"
];

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(0);
  const [resending, setResending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const floatingChars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const char = characters[Math.floor(Math.random() * characters.length)];
      const isFloatingUp = Math.random() > 0.5;
      const initialY = isFloatingUp ? 50 : -50;
      const animateY = isFloatingUp ? -50 : 50;
      return {
        key: i,
        char,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          fontSize: `${Math.random() * 24 + 18}px`,
        },
        initialY,
        animateY,
        duration: Math.random() * 10 + 10,
      };
    });
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const sendOtp = async () => {
    if (!email) return toast.error("Email is required");

    try {
      await axios.post("/api/user/send-otp-forgot", { email });
      toast.success("OTP sent to your email");
      setStep(2);
      setTimer(30);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword)
      return toast.error("All fields are required");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      await axios.post("/api/user/forgot-password", {
        email,
        otp,
        newPassword,
      });
      setShowSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center overflow-hidden px-4">
      {/* SVG/Blob Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0">
        <Lottie animationData={waveAnimation} loop autoPlay className="w-full h-full" />
      </div>

      {/* Floating Characters */}
      <div className="absolute inset-0 z-0">
        {floatingChars.map(({ key, char, style, initialY, animateY, duration }) => (
          <motion.span
            key={key}
            className="bubble-char"
            style={{
              ...style,
              color: "rgba(255,255,255,0.3)",
              position: "absolute",
              fontWeight: "bold",
              textShadow: "0 0 6px rgba(255, 255, 255, 0.3)",
            }}
            initial={{ y: initialY, opacity: 0.3 }}
            animate={{ y: animateY, opacity: 0.5, rotate: 360 }}
            transition={{
              duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md text-white p-8 rounded-xl shadow-xl"
      >
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-6 text-white text-4xl hover:text-cyan-400 transition duration-300"
          aria-label="Close"
        >
          &times;
        </button>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Lottie animationData={successAnimation} loop={false} className="w-40 h-40" />
            <p className="text-cyan-300 font-semibold">Password reset successful! Redirecting...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Forgot <span className="text-cyan-400">Password</span>
            </h2>

            {step === 1 ? (
              <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <label>Email</label>
                <motion.input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-cyan-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  whileFocus={{ scale: 1.03 }}
                />
                <motion.button
                  onClick={sendOtp}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold"
                >
                  Send OTP
                </motion.button>
              </motion.div>
            ) : (
              <motion.form onSubmit={handleReset} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <div>
                  <label>OTP</label>
                  <motion.input
                    type="text"
                    maxLength={6}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-cyan-400"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    whileFocus={{ scale: 1.03 }}
                  />
                </div>
                <div>
                  <label>New Password</label>
                  <motion.input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-cyan-400"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    whileFocus={{ scale: 1.03 }}
                  />
                </div>
                <div>
                  <label>Confirm Password</label>
                  <motion.input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-cyan-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    whileFocus={{ scale: 1.03 }}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold"
                  whileTap={{ scale: 0.95 }}
                >
                  Reset Password
                </motion.button>

                {timer > 0 ? (
                  <p className="text-center text-sm text-cyan-300">
                    Resend OTP in {timer}s
                  </p>
                ) : (
                  <motion.button
                    type="button"
                    onClick={sendOtp}
                    disabled={resending}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-cyan-300 hover:underline"
                  >
                    {resending ? "Resending..." : "Resend OTP"}
                  </motion.button>
                )}
              </motion.form>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
