const axios = require('axios');

async function extractLocationFromText(description) {
  const prompt = `Extract location from: ${description}`;
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );

  const location = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return location;
}

module.exports = { extractLocationFromText };
