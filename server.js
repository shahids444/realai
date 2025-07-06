const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');


const app = express();

// Only allow your frontend
app.use(cors({
  origin: 'https://shahids444.github.io',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve frontend

// 🔥 POST endpoint to analyze question
app.post('/analyze-question', async (req, res) => {
  const { question } = req.body;
  const prompt = `Answer this job interview question professionally:\n\n"${question}"`;

  console.log("🧠 Received question:", question);

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json'
      }
    });

    const answer = response.data.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    console.error("🔥 OpenRouter API Error:", error.response?.data || error.message);
    res.status(500).json({
      answer: "Server error: " + (error.response?.data?.error?.message || error.message)
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
