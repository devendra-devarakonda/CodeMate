import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoaderOverlay = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");

  // Detect user internet speed (Mbps)
  const getSpeed = () => {
    if (navigator.connection && navigator.connection.downlink) {
      return navigator.connection.downlink;
    }
    return 2; // fallback average speed
  };

  useEffect(() => {
    const speed = getSpeed();
    const duration = Math.min(2000, 3000 / speed); // faster loading based on speed
    const steps = 80;
    const interval = duration / steps;

    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      setProgress(count);
      if (count >= 100) {
        clearInterval(timer);
        setPhase("revealing");
        setTimeout(() => {
        setPhase("done");
        onFinish(duration + 800); // send actual reveal delay
        }, 800);
 // faster exit
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className={`fixed inset-0 z-[9999] flex items-center justify-center transition-colors duration-500 ${
            phase === "loading" ? "bg-[#0f172a]" : "bg-transparent"
          }`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {phase === "loading" && (
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="10"
                  strokeDasharray="5 5"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="10"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">{progress}%</span>
              </div>
            </div>
          )}

          {phase === "revealing" && (
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 30, opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute w-24 h-24 border-[5px] border-cyan-400 rounded-full z-50"
              style={{
                boxShadow: "0 0 60px 10px rgba(34,211,238,0.5)",
                backgroundColor: "transparent",
                pointerEvents: "none",
                mixBlendMode: "lighten"
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoaderOverlay;
