import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import socket from "../../utils/socket";
import { databases } from "../../appwrite";
import toast from "react-hot-toast";
import axios from "axios";

const DB_ID = "6879da24000386d570a5";
const COLLECTION_ID = "6879dc8d0038a1e52698";

const Sidebar = ({
  roomNo = "N/A",
  roomName = "Unnamed Room",
  adminEmail = "admin@codemate.dev",
  participants = [],
  roomId,
}) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showAddBox, setShowAddBox] = useState(false);
  const [inviteEmails, setInviteEmails] = useState([""]);
  const [participantsState, setParticipants] = useState(participants);


  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
    setIsAdmin(email === adminEmail);
  }, [adminEmail]);

  const email = localStorage.getItem("userEmail");

  const handleLeaveRoom = async () => {
    try {
      await axios.post(`/api/auth/remove-member`, {
        roomId: roomId,
        email: email,
      });

      socket.emit("leave-room", { roomId, email });

      toast.success("You have left the room.");
      navigate("/");
    } catch (err) {
      console.error("Error while leaving room:", err.message);
    }
  };

  const closeRoom = async () => {
    try {
      socket.emit("close-room", { roomId: roomNo });
      await databases.deleteDocument(DB_ID, COLLECTION_ID, roomId);
      navigate("/");
    } catch (err) {
      console.error("❌ Failed to close room:", err);
      alert("Something went wrong while closing the room.");
    }
  };

  useEffect(() => {
    socket.on("room-closed", () => {
      toast.success("❌ The room has been closed by the admin.");
      navigate("/");
    });

    return () => socket.off("room-closed");
  }, []);

  // Add participant logic
  const handleAddEmailField = () => {
    setInviteEmails([...inviteEmails, ""]);
  };

  const handleEmailChange = (index, value) => {
    const updated = [...inviteEmails];
    updated[index] = value;
    setInviteEmails(updated);
  };

  const handleSubmitInvites = async () => {
    try {
      const filtered = inviteEmails.map(e => e.trim()).filter(Boolean);
      if (filtered.length === 0) {
        return toast.error("Please enter at least one valid email.");
      }

      const res = await axios.post("/api/auth/add-members", {
        roomId,
        emails: filtered,
      });

      toast.success("Participants added successfully.");
      setShowAddBox(false);
      setInviteEmails([""]);
    } catch (err) {
      console.error("Failed to add participants:", err);
      toast.error("Failed to add participants.");
    }
  };


  useEffect(() => {
    socket.on("members-updated", (updatedMembers) => {
      setParticipants(updatedMembers); // ✅ update local state
    });

    return () => {
      socket.off("members-updated");
    };
  }, []);


  useEffect(() => {
  socket.on("member-left", (updatedMembers) => {
    setParticipants(updatedMembers);
  });

  return () => {
    socket.off("member-left");
  };
}, []);



  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 p-4 text-white flex flex-col justify-between"
    >
      <div>
        <h2 className="text-lg font-bold mb-2">Room Number:</h2>
        <p className="mb-4 text-cyan-300">{roomNo}</p>

        <h2 className="text-lg font-bold mb-2">Room:</h2>
        <p className="mb-4 text-cyan-300">{roomName}</p>

        <h3 className="text-md font-semibold mb-2">Admin:</h3>
        <div className="flex items-center gap-2 text-sm mb-4">
          <FaUserCircle className="text-cyan-400 text-lg" />
          {adminEmail}
        </div>

        <h3 className="text-md font-semibold mb-2">Participants:</h3>
        {participantsState.length > 0 ? (
          <ul className="text-sm space-y-2">
            {participantsState.map((email, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <FaUserCircle className="text-gray-400 text-lg" />
                {email}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-400">No participants added.</p>
        )}


        {/* Add Participants Box */}
        {isAdmin && (
          <>
            <button
              onClick={() => setShowAddBox(!showAddBox)}
              className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-sm"
            >
              ➕ Add Participants
            </button>

            {showAddBox && (
              <div className="mt-4 space-y-2 bg-white/5 p-3 rounded-md">
                {inviteEmails.map((email, index) => (
                  <input
                    key={index}
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="Enter participant email"
                    className="w-full px-2 py-1 text-sm rounded-md text-black"
                  />
                ))}

                <button
                  onClick={handleAddEmailField}
                  className="w-full px-4 py-1 bg-green-600 hover:bg-green-500 rounded-md text-sm"
                >
                  ➕ Add Another
                </button>

                <button
                  onClick={handleSubmitInvites}
                  className="w-full px-4 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-md text-sm"
                >
                  ✅ Submit Participants
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col gap-2">
        <button
          onClick={handleLeaveRoom}
          className="w-full px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition"
        >
          🚪 Leave Room
        </button>

        {isAdmin && (
          <button
            onClick={closeRoom}
            className="w-full px-4 py-2 text-sm bg-red-600 hover:bg-red-500 rounded-md transition"
          >
            ❌ Close Room
          </button>
        )}

        <div className="text-xs text-gray-400 text-center mt-4">
          Powered by <span className="text-cyan-400 font-semibold">CodeMate</span>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
