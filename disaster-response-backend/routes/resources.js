const express = require('express');
const router = express.Router({ mergeParams: true }); // Needed to access :id from parent route
const supabase = require('../utils/supabase');

// GET /api/disasters/:id/resources?lat=..&lon=..
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  const { id: disaster_id } = req.params;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon in query' });
  }

  const point = `SRID=4326;POINT(${lon} ${lat})`;

  try {
    const { data, error } = await supabase.rpc('find_resources_nearby', {
      center: point,
      distance: 10000
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return res.status(400).json({ error });
    }

    global.io.emit('resources_updated', { disaster_id, resources: data });
    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
