import React, { useState, useMemo , useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import waveAnimation from "../assets/animations/wave-bg.json";
import successAnimation from "../assets/animations/success.json";
import { databases, ID } from "../appwrite";


const characters = [
  "{", "}", "<", ">", "(", ")", ";", "=", "?", "&", "*",
  "A", "B", "C", "D", "E", "G", "H", "I", "K", "L", "M", "N", "O", "Q", "R", "S", "U", "V", "W", "X", "Y"
];

const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomNo, setRoomNo] = useState("");
  const [roomName, setRoomName] = useState("");
  const [participants, setParticipants] = useState([""]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setAdminEmail(email);
  }, []);


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

  const handleAddParticipant = () => setParticipants([...participants, ""]);

  const handleChangeParticipant = (index, value) => {
    const updated = [...participants];
    updated[index] = value;
    setParticipants(updated);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const invalidChars = /[.#$/\[\]]/g;
  if (!roomName || invalidChars.test(roomName)) {
    alert("❌ Room name contains invalid characters: . # $ / [ ]");
    return;
  }

  const filteredParticipants = participants.filter((p) => p.trim() !== "");
  const roomId = ID.unique();

  try {
    await databases.createDocument(
      "6879da24000386d570a5",       // replace with your Appwrite DB ID
      "6879dc8d0038a1e52698",       // Collection ID
      roomId,                       // Document ID
      {
        roomNo:roomNo,
        roomName: roomName.trim().replace(invalidChars, "_"),
        createdBy: adminEmail, 
        members: filteredParticipants,
        // createdAt: new Date().toISOString(),
      }
    );

    setShowSuccess(true);
    setTimeout(() => navigate(`/dev-room/${roomId}`), 2000);
  } catch (err) {
    console.error("❌ Appwrite error:", err);
    alert("❌ Failed to create room. Check console for details.");
  }
};


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center overflow-hidden px-4">
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
            transition={{ duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl text-white"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Lottie animationData={successAnimation} loop={false} className="w-40 h-40" />
            <p className="text-cyan-300 font-semibold">Room Created! Redirecting...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Create a <span className="text-cyan-400">Dev Room</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">


            <div>
                <label className="block mb-1 text-sm font-medium">RoomId :- Min 4 Charcters , Max 8 Charcaters</label>
                <motion.input
                  type="text"
                  value={roomNo}
                 onChange={(e) => setRoomNo(e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                  whileFocus={{ scale: 1.03 }}
                />
              </div>





              <div>
                <label className="block mb-1 text-sm font-medium">Room Name</label>
                <motion.input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                  whileFocus={{ scale: 1.03 }}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Admin Email</label>
               <motion.input
                  type="email"
                  value={adminEmail}
                  readOnly
                  className="cursor-not-allowed opacity-60 w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:outline-none"
                  whileFocus={{ scale: 1.0 }}
                />

              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Participants</label>
                {participants.map((email, index) => (
                  <motion.input
                    key={index}
                    type="email"
                    value={email}
                    onChange={(e) => handleChangeParticipant(index, e.target.value)}
                    placeholder={`Participant ${index + 1}`}
                    className="w-full px-4 py-2 mt-2 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    whileFocus={{ scale: 1.03 }}
                  />
                ))}
                <button
                  type="button"
                  onClick={handleAddParticipant}
                  className="mt-2 text-cyan-300 hover:underline text-sm"
                >
                  + Add another participant
                </button>
              </div>
              <motion.button
                type="submit"
                className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold shadow-md transition duration-300"
                whileTap={{ scale: 0.95 }}
              >
                Create Room
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CreateRoom;
