import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import successAnimation from "../assets/animations/success.json";
import waveAnimation from "../assets/animations/wave-bg.json";
import "./Register.css";

const characters = [
  "{", "}", "<", ">", "(", ")", ";", "=", "?", "&", "*",
  "A", "B", "C", "D", "E", "G", "H", "I", "K", "L", "M", "N", "O", "Q", "R", "S", "U", "V", "W", "X", "Y"
];

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      return setError("All fields are required.");
    }

    if (!isValidEmail(email)) {
      return setError("Invalid email format.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      await axios.post("/api/user/send-otp", { email });
      setShowSuccess(true);
      setTimeout(() => {
        toast.success("OTP sent successfully!");
        navigate("/verify-otp", {
          state: { email, password }
        });
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0">
        <Lottie animationData={waveAnimation} loop autoPlay className="w-full h-full" />
      </div>

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

      <motion.div
        className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl text-white"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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
            <p className="text-cyan-300 font-semibold text-center">OTP sent! Redirecting to verification...</p>
          </div>
        ) : (
          <>
            <motion.h2
              className="text-3xl font-bold mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Create <span className="text-cyan-400">Account</span>
            </motion.h2>

            <form onSubmit={handleSendOtp} className="space-y-6">
              {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}

              <motion.div className="mb-4" whileFocus={{ scale: 1.03 }}>
                <label htmlFor="email" className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@codemate.dev"
                  className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </motion.div>

              <motion.div className="mb-4" whileFocus={{ scale: 1.03 }}>
                <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </motion.div>

              <motion.div className="mb-6" whileFocus={{ scale: 1.03 }}>
                <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold shadow-md transition duration-300"
              >
                {loading ? (
                  <span className="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </motion.button>

              <p className="text-center text-sm mt-4">
                Already have an account? <a href="/login" className="text-cyan-400 hover:underline">Login</a>
              </p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
