import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatBox";
import CodeEditor from "./CodeEditor";
import { useParams, useNavigate } from "react-router-dom";
import { databases } from "../../appwrite";
import  socket  from "../../utils/socket"; // 👈 make sure this import is added

const DB_ID = "6879da24000386d570a5";
const COLLECTION_ID = "6879dc8d0038a1e52698";

const DevRoom = () => {
  const { roomId } = useParams(); 
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ Always call hooks before any early returns
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await databases.getDocument(DB_ID, COLLECTION_ID, roomId);
        setRoomData(response);
      } catch (err) {
        console.error("❌ Error fetching room from Appwrite:", err);
      }
    };
    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    socket.on("update-participants", (updatedParticipants) => {
      setRoomData((prev) => ({
        ...prev,
        members: updatedParticipants,
      }));
    });

    socket.on("room-closed", () => {
      alert("Room has been closed by the admin.");
      navigate("/");
    });

    return () => {
      socket.off("update-participants");
      socket.off("room-closed");
    };
  }, [navigate]);

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  socket.emit("join-room", { roomId, user }); // send full user object

  return () => {
    socket.emit("leave-room", { roomId, user });
  };
}, [roomId]);


  if (!roomData || !user) {
    return (
      <div className="text-white h-screen flex justify-center items-center">
        Loading DevRoom...
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#0f172a] text-white overflow-hidden">
      <Sidebar
        roomNo={roomData.roomNo}
        roomName={roomData.roomName}
        adminEmail={roomData.createdBy}
        participants={roomData.members}
        roomId={roomId}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-[350px] flex-col flex-1 h-full border-r border-white/10">
          <ChatSection roomName={roomData.roomNo} />
        </div>
        <div className="w-[650px] bg-[#101928] border-l border-white/10 overflow-y-auto">
          <CodeEditor roomId={roomId} />
        </div>
      </div>
    </div>
  );
};

export default DevRoom;
