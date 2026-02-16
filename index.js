const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// الصفحة الرئيسية للتأكد من عمل السيرفر
app.get('/', (req, res) => {
  res.json({ status: "Online", system: "Reddit Checker JS" });
});

// مسار فحص الحساب
app.get('/check/:username', async (req, res) => {
  const username = req.params.username.replace('u/', '').trim();
  const url = `https://www.reddit.com/user/${username}/about.json`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const data = response.data.data;
    res.json({
      valid: true,
      total_karma: (data.comment_karma || 0) + (data.link_karma || 0),
      created_utc: data.created_utc || 0
    });
  } catch (error) {
    res.json({ valid: false, error: "User not found or Reddit Block" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
