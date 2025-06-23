const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getCache, setCache } = require('../utils/cache');

// POST /api/verify-image/:id
router.post('/:id/verify-image', async (req, res) => {
  const { image_url } = req.body;
  const { id: disaster_id } = req.params;

  if (!image_url) {
    return res.status(400).json({ error: 'image_url is required' });
  }

  const cacheKey = `verify:${image_url}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.json({ fromCache: true, ...cached });

  try {
    const prompt = `
      Please verify if this image appears manipulated or AI-generated.
      Provide a concise analysis of its authenticity and whether it shows any signs of a disaster scene.
      Image URL: ${image_url}
    `;

   const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
  {
    contents: [{ role: "user", parts: [{ text: prompt.trim() }] }]
  }
    );

    const result =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to determine authenticity.';

    const output = { verification: result, disaster_id };

    await setCache(cacheKey, output);
    res.json(output);
  } catch (err) {
    console.error('🧠 Gemini verification failed:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Image verification failed',
      details: err.response?.data?.error?.message || err.message
    });
  }
});

module.exports = router;
