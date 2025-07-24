import { Router } from "express";
const router = Router();
import { client , Databases } from "../appwrite.js";
const databases = new Databases(client);
const DATABASE_ID = "6879da24000386d570a5";
const COLLECTION_ID = "6879dc8d0038a1e52698";


export default function userRouter(io) {
  // ADD MEMBERS
  router.post('/add-members', async (req, res) => {
    const { roomId, emails } = req.body;

    try {
      const room = await databases.getDocument(DATABASE_ID, COLLECTION_ID, roomId);

      const updatedMembers = [...new Set([...(room.members || []), ...emails])];

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, roomId, {
        members: updatedMembers,
      });

      io.to(roomId).emit("members-updated", updatedMembers); // ✅ corrected variable

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Error updating members:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // REMOVE MEMBER
  router.post('/remove-member', async (req, res) => {
    const { roomId, email } = req.body;

    if (!roomId || !email) {
      return res.status(400).json({ success: false, error: "Missing roomId or email" });
    }

    try {
      const document = await databases.getDocument(DATABASE_ID, COLLECTION_ID, roomId);

      const updatedMembers = document.members.filter((member) => member !== email);

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, roomId, {
        members: updatedMembers
      });

      io.to(roomId).emit("member-left", updatedMembers); // ✅ corrected variable

      return res.status(200).json({ success: true, updatedMembers });
    } catch (err) {
      console.error("❌ Error removing member:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}