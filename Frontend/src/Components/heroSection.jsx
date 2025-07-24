import React, { useMemo, useState, useEffect } from "react";
import DevRoomScene from "../Components/DevRoomScene";
import { motion, useMotionValue, useTransform } from "framer-motion";
import axios from "../config/axios";

const characters = [
  "{", "}", "<", ">", "(", ")", ";", "=", "?", "&", "*",
  "A", "B", "C", "D", "E", "G", "H", "I", "K", "L", "M", "N", "O", "Q", "R", "S", "U", "V", "W", "X", "Y",
  "a", "b", "c", "d", "e", "g", "h", "i", "k", "l", "m", "n", "o", "q", "r", "s", "u", "v", "w", "x", "y"
];

const Home = ({ revealNow = false }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);

  const mouseX = useMotionValue(0);
  const xTilt = useTransform(mouseX, [0, window.innerWidth], [-10, 10]);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
  };

  // ✅ Check localStorage for login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!storedUser);
  }, []);

  // Animation reveal
  useEffect(() => {
    if (revealNow) {
      const timer = setTimeout(() => setRevealComplete(true), 50);
      return () => clearTimeout(timer);
    }
  }, [revealNow]);

  // Floating characters
  const floatingChars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const char = characters[Math.floor(Math.random() * characters.length)];
      const isFloatingUp = Math.random() > 0.5;
      const initialY = isFloatingUp ? 80 : -80;
      const animateY = isFloatingUp ? -80 : 80;
      return {
        key: i,
        char,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          fontSize: `${Math.random() * 20 + 20}px`,
        },
        initialY,
        animateY,
        duration: Math.random() * 12 + 10,
        delay: Math.random() * 4,
      };
    });
  }, []);

  // ✅ Logout logic
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.get("/logout", {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // ✅ remove user too
      window.location.href = "/";
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] overflow-hidden text-white"
    >
      {/* Floating Characters */}
      {revealComplete &&
        floatingChars.map(
          ({ key, char, style, initialY, animateY, duration, delay }) => (
            <motion.span
              key={key}
              className="bubble-char"
              style={{
                ...style,
                color: "rgba(255,255,255,0.25)",
                position: "absolute",
                fontWeight: "bold",
                pointerEvents: "none",
                textShadow: "0 0 12px rgba(255, 255, 255, 0.3)",
              }}
              initial={{ y: initialY, opacity: 0 }}
              animate={{ y: animateY, opacity: [0.2, 0.5, 0.2], rotate: [0, 360] }}
              transition={{
                duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay,
              }}
            >
              {char}
            </motion.span>
          )
        )}

      {/* Dev Room */}
      {revealComplete && <DevRoomScene />}

      {/* Logo */}
      {revealComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-4 right-10 z-50"
        >
          <img
            src="/assets/logo.png"
            alt="CodeMate Logo"
            className="h-[10vw] w-auto"
          />
        </motion.div>
      )}

      {/* Hero Section */}
      {revealComplete && (
        <motion.div
          className="absolute z-20 top-0 left-[21vw] w-full h-full flex flex-col items-center justify-center text-center px-6"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ rotateY: xTilt }}
        >
          <h1 className="text-6xl md:text-6xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Welcome to <span className="text-white">CodeMate</span>
          </h1>
          <p className="max-w-xl text-lg text-gray-300 mb-8">
            Collaborate, code, and learn together in real-time with your team.
          </p>

          {/* Auth Buttons */}
          <div className="flex gap-4 flex-wrap justify-center">
            {isLoggedIn ? (
              <>
                <a
                  href="/create-room"
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
                >
                  Create Room
                </a>
                <a
                  href="/Join-room"
                  className="px-6 py-3 border border-white/30 text-white hover:border-green-400 hover:text-green-300 font-semibold rounded-lg transition duration-300"
                >
                  Join Room
                </a>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
                >
                  Get Started
                </a>
                <a
                  href="/register"
                  className="px-6 py-3 border border-white/30 text-white hover:border-cyan-400 hover:text-cyan-300 font-semibold rounded-lg transition duration-300"
                >
                  Create Account
                </a>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Footer */}
      {revealComplete && (
        <motion.div
          className="absolute bottom-0 left-0 w-full py-6 bg-white/5 backdrop-blur-sm text-white text-center z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-sm md:text-base mb-2">
            Trusted by learners and loved by creators worldwide
          </p>
          <div className="flex justify-center gap-8 items-center mt-2 flex-wrap text-sm md:text-base font-semibold tracking-wide text-gray-300">
            <div className="flex items-center gap-2">
              <span>💡</span> <span>Innovation</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👥</span> <span>Teamwork</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🧠</span> <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span> <span>Fast Deployment</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
