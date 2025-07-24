import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import "./Login.css";
import { useAuth } from "../context/AuthContext"; // ✅ import


const characters = [
  "{", "}", "<", ">", "(", ")", ";", "=", "?", "&", "*",
  "A", "B", "C", "D", "E", "G", "H", "I", "K", "L", "M", "N", "O", "Q", "R", "S", "U", "V", "W", "X", "Y"
];

const Login = () => {

  const { login } = useAuth();


  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();


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

  function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    axios
      .post("/api/user/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log("Login successful:", response.data);
        const { user } = response.data;

        localStorage.setItem("user", JSON.stringify({ email: user.email }));

        navigate("/"); // or navigate("/devroom") if that’s your route
      })

      .catch((error) => {
        console.error("Login failed:", error);
        const msg = error.response?.data?.message || "Invalid email or password.";
        setErrorMsg(msg);
      });
  }



  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center overflow-hidden">
      {/* Background Layer */}
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

      {/* Login Card */}
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


        {/* Heading */}
        <motion.h2
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Sign <span className="text-cyan-400">In</span>
        </motion.h2>

        {errorMsg && (
          <div className="mb-4 text-red-400 bg-red-400/10 px-4 py-2 rounded text-sm text-center border border-red-400/40">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email
            </label>
            <input
              onChange={(e) => setemail(e.target.value)}
              type="email"
              id="email"
              placeholder="Username"
              className="relative z-10 w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"

            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="••••••••"
              className="relative z-10 w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div className="text-right text-sm mb-6">
            <a href="/forgot-password" className="text-cyan-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold shadow-md transition duration-300"
          >
            Login
          </button>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
