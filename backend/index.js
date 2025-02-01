// server/server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// GROQ API Endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Call GROQ API for response
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192", // Adjust as needed (or another GROQ-supported model)
        messages: [{ role: "user", content: message }],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    // Extract AI response
    const botReply = response.data.choices[0].message.content.trim();
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error calling GROQ API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from GROQ API" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
