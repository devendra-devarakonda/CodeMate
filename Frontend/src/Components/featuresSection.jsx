// src/Components/Home/FeaturesSection.jsx

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRocket,
  FaLightbulb,
  FaUsers,
  FaShieldAlt,
  FaRobot,
  FaCogs,
} from "react-icons/fa";

const features = [
  {
    title: "Real-time Chat",
    description: "Instantly collaborate with team members using blazing-fast messaging and support for rich text and code.",
    icon: <FaLightbulb />,
    details: `Experience instant communication with typing indicators and live updates.\nCollaborate in dedicated rooms with zero latency.\nShare code snippets, links, and reactions in real time.\nOptimized for fast switching between projects and threads.`
  },
  {
    title: "Live Code Editor",
    description: "Edit and execute code in a shared space with live updates and real-time syntax validation.",
    icon: <FaCogs />,
    details: `Collaborative editing with smart IntelliSense support.\nSyntax highlighting and inline error hints while typing.\nSupports multiple languages and tabbed sessions.\nRuns in a secure sandboxed environment with fast outputs.`
  },
  {
    title: "AI Coding Assistant",
    description: "Get help from a smart AI trained to debug, suggest, and even write code on the fly.",
    icon: <FaRobot />,
    details: `Ask coding questions and get instant, accurate responses.\nDebug broken code with contextual explanations.\nUse autocomplete to speed up your logic writing.\nBuilt using state-of-the-art language models tuned for devs.`
  },
  {
    title: "Seamless Team Sync",
    description: "Organize teams, assign roles, track changes, and stay in sync with your crew.",
    icon: <FaUsers />,
    details: `Manage collaborators with fine-grained permissions.\nKeep logs of edits and chat histories for accountability.\nRole-based dashboards and activity feeds.\nPerfect for both casual collabs and enterprise workflows.`
  },
  {
    title: "Secure and Private",
    description: "Your code, messages, and data are protected by top-tier encryption and role controls.",
    icon: <FaShieldAlt />,
    details: `End-to-end encryption on all room interactions.\nRole-based access controls for room and project privacy.\nFrequent audits and security updates.\nZero-trust policies for third-party integrations.`
  },
  {
    title: "Lightning Fast Deployment",
    description: "Launch full-stack apps with a single click, complete with live preview and CI/CD.",
    icon: <FaRocket />,
    details: `Deploy in seconds from the room — no external setup needed.\nPreview and rollback versions instantly.\nIntegrated with Git-based workflows and auto hooks.\nSmart build caching ensures lightning fast feedback loops.`
  },
];

const FeaturesSection = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const lineRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="max-w-6xl mx-auto text-center  p-10 md:p-20  relative z-10"
    >
      <h2 className="text-4xl md:text-5xl font-extrabold text-cyan-300 mb-3">Features</h2>
      <div
        ref={lineRef}
        className="w-24 h-1 mx-auto bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 transform origin-left rounded-full mb-10"
      />

      <div className="grid md:grid-cols-3 gap-6 text-left">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedCard(feature)}
            className="cursor-pointer rounded-xl bg-[#1e293b]/60 border border-cyan-400/10 p-6 backdrop-blur-md hover:shadow-md hover:shadow-cyan-400/20 transition-all"
          >
            <div className="text-3xl text-cyan-300 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-slate-300 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Modal for Feature Details */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl max-h-[70vh] overflow-y-auto bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-8 rounded-xl shadow-xl border border-cyan-500/10 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 text-cyan-300 hover:text-red-400 text-xl font-bold"
              >
                ×
              </button>
              <div className="text-5xl text-cyan-300 mb-4">{selectedCard.icon}</div>
              <h3 className="text-3xl font-bold mb-2 text-white">{selectedCard.title}</h3>
              <p className="text-slate-300 text-base mb-6">{selectedCard.description}</p>
              <p className="text-slate-400 text-sm whitespace-pre-line leading-relaxed">{selectedCard.details}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FeaturesSection;
