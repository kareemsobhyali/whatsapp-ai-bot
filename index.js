import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const API_KEY = process.env.OPENROUTER_KEY;

app.post("/reply", async (req, res) => {
  const userMessage = req.body.message || "";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || "Error";

    res.json({
      reply: botReply
    });

  } catch (err) {
    res.json({ reply: "Server error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));