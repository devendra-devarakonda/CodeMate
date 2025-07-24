import React, { useState, useEffect, useRef } from "react";
import socket from "../../utils/socket";
import { FaUserCircle, FaRegCopy, FaCheck } from "react-icons/fa";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatSection = ({ roomName }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentUser = user?.email;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]); // ← Updated for multiple users
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
  socket.emit("join-room", { roomId: roomName, user: currentUser });

  socket.on("receive-message", (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  socket.on("typing-users", (users) => {
    const others = users.filter((u) => u !== currentUser);
    setTypingUsers(others);
  });

  return () => {
    socket.off("receive-message");
    socket.off("typing-users");
  };
}, [roomName, currentUser]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = () => {
    socket.emit("typing", { roomId: roomName, userEmail: currentUser });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { roomId: roomName, userEmail: currentUser });
    }, 1000);
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const inputText = input.trim();
    setInput("");
    const isAiCommand = inputText.toLowerCase().startsWith("@ai");

    const messageData = {
      sender: currentUser,
      text: inputText,
      timestamp: new Date().toLocaleTimeString(),
      private: isAiCommand,
    };

    socket.emit("stop-typing", { roomId: roomName, userEmail: currentUser });
    setMessages((prev) => [...prev, messageData]);

    if (!isAiCommand) {
      socket.emit("send-message", { roomId: roomName, message: messageData });
    } else {
      const userQuery = inputText.replace(/@ai/i, "").trim();
      setTyping(true);

      try {
        const response = await axios.post("http://localhost:5000/api/ai/ask", {
          prompt: userQuery,
        });

        const aiReply = response?.data?.reply || "(AI failed to respond)";
        const aiMessage = {
          sender: "@AI Assistant",
          text: aiReply,
          timestamp: new Date().toLocaleTimeString(),
          private: true,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        console.error("AI request failed", err);
        setMessages((prev) => [
          ...prev,
          {
            sender: "@AI Assistant",
            text: "⚠️ Sorry, something went wrong while processing your request.",
            timestamp: new Date().toLocaleTimeString(),
            private: true,
          },
        ]);
      } finally {
        setTyping(false);
      }
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10 text-xl font-semibold text-cyan-300">
        💬 Chat - {roomName}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-gray-400">No messages yet...</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`relative px-3 py-2 max-w-[80%] rounded-md ${
                msg.sender === currentUser
                  ? "ml-auto bg-teal-700 text-right"
                  : "mr-auto bg-white/10 text-left"
              } ${msg.private ? "bg-cyan-900/20" : ""}`}
            >
              {msg.sender === "@AI Assistant" && (
                <button
                  onClick={() => handleCopy(msg.text, idx)}
                  className="absolute top-2 right-24 text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md flex items-center gap-1"
                >
                  {copiedIndex === idx ? (
                    <>
                      <FaCheck className="text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <FaRegCopy />
                      Copy
                    </>
                  )}
                </button>
              )}

              <div className="flex justify-between">
                <span className="text-cyan-300 font-medium mr-2">
                  <FaUserCircle className="inline-block mr-1" />
                  {msg.sender === currentUser ? "You" : msg.sender}
                </span>
                <span className="text-xs text-gray-400">{msg.timestamp}</span>
              </div>

              <div className="prose prose-sm prose-invert max-w-none mt-1">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md"
                          wrapLongLines
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-800 px-1 py-0.5 rounded text-pink-300" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}

        {/* Typing indicators */}
        {typing && (
          <div className="text-sm text-gray-400 italic text-center animate-pulse">
            🧠 AI Assistant is typing...
          </div>
        )}

        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-400 italic text-center animate-pulse">
            ✍️ {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-[#0f172a]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message or '@ai What is React?'..."
            className="flex-1 px-4 py-2 bg-white/10 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold shadow-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
