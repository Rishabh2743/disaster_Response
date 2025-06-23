const express = require('express');
const router = express.Router();
const { getWKTFromLocation } = require('../utils/geocode');

router.post('/location', async (req, res) => {
  const { location_name } = req.body;
  if (!location_name) {
    return res.status(400).json({ error: 'location_name is required' });
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
