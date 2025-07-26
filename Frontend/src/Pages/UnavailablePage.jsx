import React from "react";
import { FaLinkedin, FaVideo } from "react-icons/fa";

const UnavailablePage = () => {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6 text-center overflow-hidden">

      {/* Floating sad emojis */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-4xl animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.1,
            }}
          >
            😢
          </span>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="animate-bounce-slow mb-4 text-6xl">😞</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-red-500 animate-pulse">
          Room Unavailable
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
          Due to limitations in free hosting services like <span className="text-yellow-300">Render</span> and <span className="text-yellow-300">Railway</span>,
          <span className="text-green-400 font-semibold"> WebSockets are not supported on free plans</span>.
        </p>

        <p className="mt-4 text-md md:text-lg text-gray-400">
          Real-time features like chat and collaborative code editor are currently disabled 😔
        </p>

        <a
          href="https://www.linkedin.com/in/dev-devarakonda/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-lg font-semibold transition-all duration-300"
        >
          <FaVideo size={22} />
          Watch Full Demo on LinkedIn
        </a>

        <p className="mt-6 text-sm text-gray-500">
          💻 CodeMate works best on <span className="text-cyan-400 font-semibold">desktops/laptops</span>.
        </p>
      </div>

      {/* Tailwind Custom Animations */}
      <style>
        {`
          @keyframes float-slow {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }

          .animate-float-slow {
            animation: float-slow 6s ease-in-out infinite;
          }

          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }

          .animate-bounce-slow {
            animation: bounce-slow 2s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default UnavailablePage;
