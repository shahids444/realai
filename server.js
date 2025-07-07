const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/analyze-question', async (req, res) => {
  const { question } = req.body;
  const prompt = `Answer this job interview question professionally:\n\n"${question}"`;

  console.log("🧠 Received question:", question);
  console.log("🔑 API Key Present:", !!OPENROUTER_API_KEY);

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error("🔥 OpenRouter API Error:", error.response?.data || error.message);
    res.status(500).json({ answer: "Server error: " + (error.response?.data?.error?.message || error.message) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
