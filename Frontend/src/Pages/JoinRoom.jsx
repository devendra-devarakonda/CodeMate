// src/Pages/JoinRoom.jsx

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import waveAnimation from "../assets/animations/wave-bg.json";
import successAnimation from "../assets/animations/success.json";
import { databases } from "../appwrite";
import { Query } from "appwrite";

const APPWRITE_DATABASE_ID = "6879da24000386d570a5";
const APPWRITE_ROOMS_COLLECTION_ID = "6879dc8d0038a1e52698";

const characters = [
  "{", "}", "<", ">", "(", ")", ";", "=", "?", "&", "*",
  "A", "B", "C", "D", "E", "G", "H", "I", "K", "L", "M", "N", "O", "Q", "R", "S", "U", "V", "W", "X", "Y"
];

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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

const handleJoin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    if (!roomId.trim()) {
      setError("⚠️ Please enter a room ID.");
      return;
    }

    
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      setError("❌ You must be logged in to join a room.");
      return;
    }

    // ✅ Query room by roomId
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_ROOMS_COLLECTION_ID,
      [Query.equal("roomNo", roomId.trim())]
    );

    if (response.total > 0) {
      const roomDoc = response.documents[0];

      // ✅ Check if user email is in members
      const members = roomDoc.members || [];
      const isMember = members.includes(userEmail);

      if (!isMember) {
        setError("❌ You are not authorized. Ask the admin for access.");
        return;
      }

      // ✅ Everything good: redirect
      setSuccess(true);
      setTimeout(() => {
        navigate(`/dev-room/${roomDoc.$id}`);
      }, 1500);
    } else {
      setError("❌ Invalid Room ID. Please enter a correct one.");
    }
  } catch (err) {
    console.error("Join room error:", err.message || err);
    setError("❌ An error occurred while joining the room.");
  }
};



  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center overflow-hidden px-4">
      {/* Background Animation */}
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
            transition={{ duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* Main Box */}
      <motion.div
        className="relative z-10 w-full max-w-lg p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl text-white"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {success ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Lottie animationData={successAnimation} loop={false} className="w-40 h-40" />
            <p className="text-cyan-300 font-semibold">Room Found! Redirecting...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Join a <span className="text-cyan-400">Dev Room</span>
            </h2>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Room ID</label>
                <motion.input
                  type="text"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                  whileFocus={{ scale: 1.03 }}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <motion.button
                type="submit"
                className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold shadow-md transition duration-300"
                whileTap={{ scale: 0.95 }}
              >
                Join Room
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default JoinRoom;
