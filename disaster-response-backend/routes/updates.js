const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const { getCache, setCache } = require('../utils/cache');

// GET /api/updates/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `updates:${id}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) return res.json({ fromCache: true, updates: cached });

    const response = await axios.get('https://www.redcross.org/');
    const $ = cheerio.load(response.data);

    const updates = [];
    $('a').each((i, link) => {
      const text = $(link).text();
      const href = $(link).attr('href');
      if (href && text.toLowerCase().includes('disaster')) {
        updates.push({ text, url: href.startsWith('http') ? href : `https://www.redcross.org${href}` });
      }
    });

    await setCache(cacheKey, updates);
    res.json({ updates });
  } catch (err) {
    console.error('Error in /updates/:id →', err); // <--- Add this
    res.status(500).json({ error: 'Failed to fetch updates', details: err.message });
  }
});
module.exports = router;