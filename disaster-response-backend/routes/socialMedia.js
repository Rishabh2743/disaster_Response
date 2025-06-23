// routes/socialMedia.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCache, setCache } = require('../utils/cache');

const mockPosts = [
  { post: "#floodrelief Need food in NYC", user: "citizen1" },
  { post: "Earthquake damage in SF", user: "citizen2" },
  { post: "Flooded roads in Houston", user: "citizen3" },
  { post: "Need rescue boats #flood", user: "citizen4" },
  { post: "#help Earthquake rescue", user: "citizen5" },
  { post: "#emergency Fire in LA", user: "citizen6" },
  { post: "Water levels rising fast", user: "citizen7" },
  { post: "Bridge collapsed due to flood", user: "citizen8" },
  { post: "#disaster Helicopter rescue", user: "citizen9" },
  { post: "Medical help needed urgently", user: "citizen10" }
];

router.get('/', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `social:${id}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) return res.json({ fromCache: true, posts: cached });

    await setCache(cacheKey, mockPosts);
    global.io?.emit('social_media_updated', { disaster_id: id, posts: mockPosts });

    res.json({ posts: mockPosts });
  } catch (err) {
    console.error('Error fetching social media:', err);
    res.status(500).json({ error: 'Failed to fetch social media', details: err.message });
  }
});

module.exports = router;
