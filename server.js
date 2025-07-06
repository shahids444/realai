const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// ✅ Use OpenRouter instead of default OpenAI
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1", // ✅ Required for OpenRouter
  apiKey: process.env.OPENROUTER_API_KEY,   // ✅ From .env file
});

app.post('/analyze-question', async (req, res) => {
  const { question } = req.body;
  const prompt = `Answer this job interview question professionally:\n\n"${question}"`;

  console.log("🧠 Received question:", question);
  console.log("🔑 API Key Present:", !!process.env.OPENROUTER_API_KEY);

  try {
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct", // ✅ Free & fast OpenRouter model
      messages: [{ role: "user", content: prompt }]
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error("🔥 OpenRouter API Error:", error);
    res.status(500).json({ answer: "Server error: " + (error.message || "unknown") });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
