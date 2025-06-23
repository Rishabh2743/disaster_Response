const express = require('express');
const router = express.Router();
const { extractLocationFromText } = require('../utils/gemini');
const { getCache, setCache } = require('../utils/cache');

// POST /api/geocode
router.post('/', async (req, res) => {
  try {
    const { description } = req.body;
    const cacheKey = `geocode:${description}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json({ fromCache: true, ...cached });

    const locationName = await extractLocationFromText(description);
    const latLng = await getLatLng(locationName);
    const result = { locationName, ...latLng };

    await setCache(cacheKey, result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Geocoding failed', details: err.message });
  }
});


// GET /api/geocode/location?location_name=New York City
router.get('/location', async (req, res) => {
  const { location_name } = req.query;

  if (!location_name) {
    return res.status(400).json({ error: 'location_name query param is required' });
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location_name)}`);
    const data = await response.json();

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const { lon, lat } = data[0];
    const wkt = `POINT(${lon} ${lat})`;

    res.json({ location_name, wkt });
  } catch (err) {
    console.error('Geocode error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
