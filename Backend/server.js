// import http from 'http';
// import dotenv from 'dotenv';
// dotenv.config();


// import userRouter from "./routes/auth.route.js";



// import app from './app.js';




// import { Server } from "socket.io";


// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // your frontend URL
//     credentials: true,
//   },
// });

// app.use('/api/auth', userRouter(io));

// const typingUsers = new Map();
// const roomParticipants = {};

// io.on("connection", (socket) => {
//   console.log("✅ New user connected");

//   // Step 1: Join a room
// socket.on("join-room", async ({ roomId, email }) => {
//   if (!roomParticipants[roomId]) {
//     roomParticipants[roomId] = {};
//   }
//   roomParticipants[roomId][email] = true;

//   socket.join(roomId);
//   io.to(roomId).emit("update-participants", roomParticipants[roomId]);

//   // ✅ Re-send latest code and language to the joined user
//   try {
//     const roomDoc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, roomId);

//     socket.emit("code-change", {
//       code: roomDoc.CodeContent || "// Start coding...",
//       user: "System",
//     });

//     socket.emit("language-update", {
//       language: roomDoc.language || "javascript",
//     });

//     console.log(`🟢 Code sent to ${email} on join`);
//   } catch (error) {
//     console.error("❌ Failed to fetch code for room:", error.message);
//   }
// });



// socket.on("code-change", ({ roomId, code, user, cursor }) => {
//   socket.to(roomId).emit("code-change", { code, user });
//   socket.to(roomId).emit("cursor-change", { position: cursor, user }); // ✅ FIXED
// });

// socket.on("cursor-change", ({ roomId, position, user }) => {
//   socket.to(roomId).emit("cursor-change", { position, user }); // ✅ FIXED
// });


// socket.on("language-change", ({ roomId, language }) => {
//   socket.to(roomId).emit("language-update", { language });
// });

//   // Step 2: When user sends a message
//   socket.on("send-message", ({ roomId, message }) => {
//     console.log(`📨 Message received for room ${roomId}:`, message);
//     // Broadcast to others in room (excluding sender)
//     socket.to(roomId).emit("receive-message", message);
//   });

//   socket.on("typing", ({ roomId, userEmail }) => {
//     if (!typingUsers.has(roomId)) typingUsers.set(roomId, new Set());
//     typingUsers.get(roomId).add(userEmail);
//     io.to(roomId).emit("typing-users", Array.from(typingUsers.get(roomId)));
//   });

//   // Listen for stop typing event
//   socket.on("stop-typing", ({ roomId, userEmail }) => {
//     if (typingUsers.has(roomId)) {
//       typingUsers.get(roomId).delete(userEmail);
//       io.to(roomId).emit("typing-users", Array.from(typingUsers.get(roomId)));
//     }
//   });


//   // Add this in io.on("connection", ...) block
// socket.on("leave-room", ({ roomId, userEmail }) => {
//     if (roomParticipants[roomId] && roomParticipants[roomId][userEmail]) {
//       roomParticipants[roomId][userEmail] = false;
//       io.to(roomId).emit("update-participants", roomParticipants[roomId]);
//     }
//   });

// socket.on("close-room", ({ roomId }) => {
//     delete roomParticipants[roomId];
//     io.to(roomId).emit("room-closed");
//   });



//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected");
//   });
// });


// server.listen(5000, () => {
//   console.log("Server listening on port 5000");
// });


import http from 'http';
import dotenv from 'dotenv';
import connection from './config/db.js';
dotenv.config();



import app from './app.js';

import userRouter from "./routes/auth.route.js";




import { Server } from "socket.io";


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://codemate-99nl.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true
  }
});


app.use('/api/auth', userRouter(io));

const port = process.env.PORT || 5000;

const typingUsers = new Map();

const roomParticipants = {};

const DATABASE_ID = "6879da24000386d570a5";
const COLLECTION_ID = "6879dc8d0038a1e52698";

io.on("connection", (socket) => {
  console.log("✅ New user connected");

  // Step 1: Join a room
 socket.on("join-room", async ({ roomId, user }) => {
  socket.join(roomId);
  console.log(`👥 ${user} joined room: ${roomId}`);

   try {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, roomId);
    socket.emit("code-change", { code: doc.CodeContent, user: "System" });
    socket.emit("language-update", { language: doc.language });
  } catch (e) {
    console.warn("No room doc found, starting fresh");
  }
});

socket.on("code-change", ({ roomId, code, user, cursor }) => {
  socket.to(roomId).emit("code-change", { code, user });
  socket.to(roomId).emit("cursor-change", { position: cursor, user }); // ✅ FIXED
});

socket.on("cursor-change", ({ roomId, position, user }) => {
  socket.to(roomId).emit("cursor-change", { position, user }); // ✅ FIXED
});


socket.on("language-change", ({ roomId, language }) => {
  socket.to(roomId).emit("language-update", { language });
});


  // Step 2: When user sends a message
  socket.on("send-message", ({ roomId, message }) => {
    console.log(`📨 Message received for room ${roomId}:`, message);
    // Broadcast to others in room (excluding sender)
    socket.to(roomId).emit("receive-message", message);
  });

  socket.on("typing", ({ roomId, userEmail }) => {
    if (!typingUsers.has(roomId)) typingUsers.set(roomId, new Set());
    typingUsers.get(roomId).add(userEmail);
    io.to(roomId).emit("typing-users", Array.from(typingUsers.get(roomId)));
  });

  // Listen for stop typing event
  socket.on("stop-typing", ({ roomId, userEmail }) => {
    if (typingUsers.has(roomId)) {
      typingUsers.get(roomId).delete(userEmail);
      io.to(roomId).emit("typing-users", Array.from(typingUsers.get(roomId)));
    }
  });


   // Add this in io.on("connection", ...) block
 socket.on("leave-room", ({ roomId, userEmail }) => {
     if (roomParticipants[roomId] && roomParticipants[roomId][userEmail]) {
       roomParticipants[roomId][userEmail] = false;
        io.to(roomId).emit("update-participants", roomParticipants[roomId]);
    }
   });

 socket.on("close-room", ({ roomId }) => {
     delete roomParticipants[roomId];
     io.to(roomId).emit("room-closed");
   });


  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

// ✅ Connect to DB first, then start server
connection().then(() => {
  app.listen(port, () => {
    console.log("");
  });
});
