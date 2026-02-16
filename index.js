const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// 1. SERVE FRONTEND: This sends the HTML file when you visit the main URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. BACKEND API: The logic to check Reddit Karma and Age
app.get('/check/:username', async (req, res) => {
  const username = req.params.username.replace('u/', '').trim();
  const url = `https://www.reddit.com/user/${username}/about.json`;

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const data = response.data.data;
    res.json({
      valid: true,
      total_karma: (data.comment_karma || 0) + (data.link_karma || 0),
      created_utc: data.created_utc || 0
    });
  } catch (error) {
    res.json({ valid: false, error: "Account Not Found" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
