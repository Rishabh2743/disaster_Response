const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function getWKTFromLocationName(location_name) {
  if (!location_name) throw new Error('location_name is required');

  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location_name)}`);
  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error('Location not found');
  }

  const { lon, lat } = data[0];
  return `POINT(${lon} ${lat})`;
};

// ✅ Utility to update location post-insert
async function locationUpdate(location_name, disasterId) {
  try {
    const { wkt } = await getWKTFromLocationName(location_name);
    console.log('📍 Location WKT:', wkt);
    const { data, error } = await supabase
      .from('disasters')
      .update({ location: wkt })
      .eq('id', disasterId)
      .select();

    if (error) {
      console.error('❌ Location update error:', error);
      return null;
    }

    console.log('📍 Location updated post-insert:', wkt);
    return data[0]; // return updated record
  } catch (err) {
    console.error('⚠️ Geocoding failed:', err.message);
    return null;
  }
}

// POST /api/disasters
router.post('/', async (req, res) => {
  const { title, location_name, location , description, tags, owner_id } = req.body;
   
  const { data, error } = await supabase.from('disasters').insert([
    {
      title,
      location_name,
      location,
      description,
      tags,
      owner_id,
      audit_trail: [{ action: 'create', user_id: owner_id, timestamp: new Date().toISOString() }]
    }
  ]).select();

  if (error) return res.status(400).json({ error });

  const insertedDisaster = data[0];
  const updated = await locationUpdate(location_name, insertedDisaster.id);

  global.io.emit('disaster_updated', data[0]);
  res.status(201).json(data[0]);
});

// GET /api/disasters?tag=xyz
router.get('/', async (req, res) => {
  const tag = req.query.tag;
  let query = supabase.from('disasters').select('*');

  if (tag) query = query.contains('tags', [tag]);

  const { data, error } = await query;
  if (error) return res.status(400).json({ error });
  res.json(data);
});

// PUT /api/disasters/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase.from('disasters').update({
    ...updates,
    audit_trail: [{ action: 'update', user_id: updates.owner_id, timestamp: new Date().toISOString() }]
  }).eq('id', id).select();

  if (error) return res.status(400).json({ error });
  global.io.emit('disaster_updated', data[0]);
  res.json(data[0]);
});

// DELETE /api/disasters/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('disasters').delete().eq('id', id);
  if (error) return res.status(400).json({ error });
  global.io.emit('disaster_updated', { id, deleted: true });
  res.status(204).send();
});

module.exports = router;
