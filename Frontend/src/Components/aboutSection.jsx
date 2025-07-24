import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  FaCogs, FaRobot, FaLightbulb, FaUsers, FaShieldAlt, FaRocket,
} from "react-icons/fa";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

const SpinningObject = ({ scrollYProgress }) => {
  const meshRef = useRef();
  const y = useTransform(scrollYProgress, [0, 1], [0, -1.5]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 4]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotateY.get();
      meshRef.current.rotation.x = rotateX.get();
      meshRef.current.position.y = y.get();
    }
  });

  return (
    <group ref={meshRef} position={[0, -2, -4]}>
      <mesh>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial color="#00ffff" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
};

const features = [
  {
    title: "Real-time Chat",
    description: "Collaborate with your team instantly using lightning-fast messaging with rich formatting and support for code snippets.",
    icon: <FaLightbulb />,
    details: "Stay connected with your team through blazing-fast, real-time messaging. Enjoy typing indicators, read receipts, emoji reactions, and markdown support for formatting and code snippets. Conversations stay organized and context-aware. Whether it’s a quick fix or a deep discussion, communication feels natural and immediate."
  },
  {
    title: "Live Code Editor",
    description: "Write, edit, and run code in a shared environment with live synchronization across all users in the room.",
    icon: <FaCogs />,
    details: "Code together in real-time with full synchronization across collaborators. The editor supports syntax highlighting, auto-indentation, and inline error tracking. Watch teammates edit in real time, reducing context-switching and miscommunication. Perfect for debugging sessions, live reviews, and building apps as a team."
  },
  {
    title: "AI Coding Assistant",
    description: "Get instant help from an integrated AI assistant trained to answer coding and debugging questions in real time.",
    icon: <FaRobot />,
    details: "Harness the power of advanced AI trained on billions of lines of code. Get context-aware suggestions, quick explanations, auto-complete, and intelligent debugging tips. The assistant helps you solve problems faster and learn better — like a mentor always on standby. Just ask and code smarter."
  },
  {
    title: "Seamless Team Sync",
    description: "Invite collaborators, assign roles, and stay in sync effortlessly with notifications and shared history.",
    icon: <FaUsers />,
    details: "Organize your team with clarity and ease. Assign roles like admin or viewer, manage access levels, and keep everyone aligned with real-time notifications. Track activity history, shared messages, and code changes — all synced across your team. Never miss a beat in your workflow."
  },
  {
    title: "Secure and Private",
    description: "End-to-end encrypted rooms with role-based access controls to ensure your code and chats stay safe.",
    icon: <FaShieldAlt />,
    details: "Your data is protected with end-to-end encryption and military-grade security protocols. Role-based access ensures only the right people see sensitive content. Everything — from code to conversations — stays private and tamper-proof. Trust your workspace with enterprise-grade protection and peace of mind."
  },
  {
    title: "Lightning Fast Deployment",
    description: "Instantly deploy full-stack apps from within the room, complete with previews and rollback support.",
    icon: <FaRocket />,
    details: "Go from idea to live app without leaving the room. Deploy full-stack projects instantly with integrated CI/CD, live previews, and auto-rollback for safety. Collaborators can view deployments in real-time and suggest changes. It’s frictionless shipping — no terminal, no wait, just deploy and go."
  },
];


const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cardParent = {
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const AboutSection = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const [selectedCard, setSelectedCard] = useState(null);
  const modalRef = useRef();

  // Scroll to center on modal open
  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        modalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedCard]);

  return (
    <section
      id="about"
      className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8 bg-transparent text-white z-10"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [3, 1, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 5]} />
          <Suspense fallback={null}>
            <SpinningObject scrollYProgress={scrollYProgress} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Background Glows */}
      <motion.div className="absolute -top-20 -left-32 w-[500px] h-[500px] bg-cyan-400/10 blur-3xl rounded-full animate-pulse z-0" />
      <motion.div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-400/10 blur-3xl rounded-full animate-pulse z-0" />

      {/* Parallax Icons */}
      <motion.div style={{ y: y1, rotate }} className="absolute top-10 left-10 text-white/10 text-7xl z-0">
        <FaCogs />
      </motion.div>
      <motion.div style={{ y: y2, rotate }} className="absolute bottom-10 right-10 text-white/10 text-7xl z-0">
        <FaRobot />
      </motion.div>

      {/* Title & Intro */}
      <div className="mx-auto max-w-3xl lg:text-center z-10 relative">
        <h2 className="text-base font-semibold leading-7 text-cyan-400">What is CodeMate?</h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 sm:text-5xl">
          CodeMate
        </p>
        <p className="mt-6 text-lg leading-8 text-white/80">
          CodeMate is your intelligent development partner. Chat, code, deploy — together. Designed for next-gen collaboration with built-in AI, real-time tools, and beautiful design.
        </p>
      </div>

      {/* Feature Cards */}
      <motion.div
        variants={cardParent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-12 grid gap-6 md:grid-cols-3 text-left z-10 relative"
      >
        {features.map((card, index) => (
          <motion.div
            variants={fadeInUp}
            key={index}
            onClick={() => setSelectedCard(card)}
            className="cursor-pointer rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 bg-opacity-60 p-6 backdrop-blur-sm border border-blue-300/10 shadow-md hover:shadow-cyan-500/30 transform hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300"
          >
            <div className="mb-4 text-3xl text-cyan-400">{card.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-white">{card.title}</h3>
            <p className="text-white/80 text-sm">{card.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal Expanded Card */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: "100vh", rotateY: -90 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            exit={{ opacity: 0, y: "100vh", rotateY: 90 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl h-[55vh] overflow-y-auto bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 p-8 rounded-xl shadow-xl text-white"
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-3 right-4 text-white text-3xl leading-none"
              >
                &times;
              </button>
              <div className="text-5xl text-cyan-400 mb-4">{selectedCard.icon}</div>
              <h3 className="text-3xl font-bold mb-2">{selectedCard.title}</h3>
              <p className="text-white/90 text-base mb-6">{selectedCard.description}</p>
              <p className="text-white/70 text-sm whitespace-pre-line leading-relaxed">
                {selectedCard.details}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AboutSection;
