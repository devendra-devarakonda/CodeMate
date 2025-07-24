import express from "express";
import axios from "axios";
const router = express.Router();

const GEMINI_API_KEY = "AIzaSyAVoeaVLip-mBJb0k56HtJyQtp5lXiZRYg";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

router.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  console.log("🔐 GEMINI_API_KEY:", GEMINI_API_KEY);
  console.log("🔗 GEMINI_API_URL:", GEMINI_API_URL);
  console.log("📩 Prompt received:", prompt);

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({ message: "AI failed" });
  }
});

export default router;
