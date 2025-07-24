import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../config/axios";
import Lottie from "lottie-react";
import successAnimation from "../assets/animations/success.json";
import waveAnimation from "../assets/animations/wave-bg.json";
// ✅ adjust path if needed


const characters = ["<", "/", ">", "{", "}", "(", ")", "*", "&", "#", "@", "A", "B", "C", "D", "E", "F"];

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password } = location.state || {};

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
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
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !otp) {
      setLoading(false);
      return setError("Missing required information.");
    }

    try {
      // Step 1: Verify OTP
      await axios.post("/api/user/verify-otp", { email, otp });

      // Step 2: Register user
      const response = await axios.post("/api/user/register", { email, password, otp });
      const { user } = response.data;

      // ✅ Save to localStorage
      localStorage.setItem("user", JSON.stringify({ email: user.email }));

      setShowSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }

  };



  const handleResendOtp = async () => {
    setError("");
    setResending(true);
    try {
      await axios.post("/api/user/send-otp", { email });
      setTimer(30);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center overflow-hidden px-4">
      {/* Wave Animation Background */}
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

      {/* OTP Verification Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl text-white"
      >
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Lottie animationData={successAnimation} loop={false} className="w-40 h-40" />
            <p className="text-cyan-300 font-semibold">OTP Verified! Redirecting...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Verify <span className="text-cyan-400">Your Email</span>
            </h2>

            <form onSubmit={handleSubmit}>
              {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

              <label htmlFor="otp" className="block mb-2 text-sm font-medium">
                Enter the OTP sent to your email Plase Check your spam folder if not found.
              </label>
              <motion.input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-4"
                required
                whileFocus={{ scale: 1.03 }}
              />

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-lg font-semibold shadow-md transition duration-300"
                whileTap={{ scale: 0.95 }}
              >
                {loading ? "Verifying..." : "Verify"}
              </motion.button>

              <p className="text-center text-sm mt-4">
                Didn't receive code?{" "}
                {timer > 0 ? (
                  <span className="text-cyan-400">Resend in {timer}s</span>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="text-cyan-400 hover:underline"
                    whileTap={{ scale: 0.95 }}
                  >
                    {resending ? "Resending..." : "Resend OTP"}
                  </motion.button>
                )}
              </p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OtpVerification;
