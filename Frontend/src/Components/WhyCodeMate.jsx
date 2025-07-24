import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WhyCodeMateSection = () => {
  const gradientLineRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      gradientLineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gradientLineRef.current,
          start: 'top 85%',
        },
      }
    );
  }, []);

  return (
    <section id="why" className="w-full py-24 px-6 md:px-24 relative overflow-hidden z-10">
      {/* Floating background visuals */}
      <div className="absolute left-10 top-20 text-white/10 text-6xl animate-float-slow">{'<>'}</div>
      <div className="absolute right-10 bottom-24 text-white/10 text-7xl animate-float">{'</>'}</div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto text-center backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-10 md:p-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Why CodeMate?</h2>
        <div
          ref={gradientLineRef}
          className="w-24 h-1 mx-auto bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-400 transform origin-left rounded-full mb-10"
        />

        <div className="grid md:grid-cols-2 gap-10 text-left">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm"
          >
            <h3 className="text-white text-xl font-semibold mb-2">Real-time Collaboration</h3>
            <p className="text-gray-400">
              CodeMate allows devs to edit code in real-time, communicate in group chat, and work on live projects together — just like VS Code + Slack in your browser.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm"
          >
            <h3 className="text-white text-xl font-semibold mb-2">AI Superpowers</h3>
            <p className="text-gray-400">
              Our AI assistant helps you debug, write functions, or understand code — like ChatGPT but trained for your team’s workspace and context.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm"
          >
            <h3 className="text-white text-xl font-semibold mb-2">Secure, Fast, and Scalable</h3>
            <p className="text-gray-400">
              Built on Redis, Socket.IO, MongoDB, and Express.js — it scales with your team and keeps sessions fast and secure.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm"
          >
            <h3 className="text-white text-xl font-semibold mb-2">Built for Hackathons & Startups</h3>
            <p className="text-gray-400">
              Whether it’s a college hackathon or your startup’s MVP, CodeMate gives you a launch-ready platform with no extra setup.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default WhyCodeMateSection;
