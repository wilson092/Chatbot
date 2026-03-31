/**
 * 💎 Permata AI - Backend Server
 * Menggunakan OpenRouter API untuk AI Chat
 */

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 API KEY OPENROUTER
// Dapatkan API Key dari: https://openrouter.ai/keys
const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
    console.error("❌ ERROR: OPENROUTER_API_KEY tidak ditemukan di .env file!");
    process.exit(1);
}

// 🚀 ENDPOINT AI CHAT
app.post("/ai", async (req, res) => {
    const { message, model = "openai/gpt-3.5-turbo", temperature = 0.7, maxTokens = 2000 } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message required" });
    }

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: model,
                messages: [
                    { role: "user", content: message }
                ],
                temperature: temperature,
                max_tokens: maxTokens,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.choices[0].message.content;
        
        res.json({ 
            reply,
            model: model,
            tokens: response.data.usage?.total_tokens || 0
        });

    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        res.status(500).json({ 
            error: error.response?.data?.error?.message || "AI error occurred",
            details: error.message
        });
    }
});

app.listen(3000, () => {
    console.log("💎 Permata AI Server running at http://localhost:3000");
    console.log("🤖 OpenRouter API configured and ready");
});