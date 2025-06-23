const request = require('supertest');
const app = require('../index');

// ✅ Mock cache utils
jest.mock('../utils/cache', () => ({
  getCache: jest.fn(),
  setCache: jest.fn()
}));

// ✅ Fake global socket.io emitter
global.io = { emit: jest.fn() };

const { getCache, setCache } = require('../utils/cache');

describe('Social Media API', () => {
  const disasterId = 'abc123';
  const mockPosts = [
    { post: "#floodrelief Need food in NYC", user: "citizen1" },
    { post: "Earthquake damage in SF", user: "citizen2" }
  ];

  beforeEach(() => {
    getCache.mockReset();
    setCache.mockReset();
    global.io.emit.mockReset();
  });

  test('GET /api/social-media/:id - returns cached data', async () => {
    getCache.mockResolvedValueOnce(mockPosts);

    const res = await request(app).get(`/api/social-media/${disasterId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ fromCache: true, posts: mockPosts });
    expect(getCache).toHaveBeenCalledWith(`social:${disasterId}`);
    expect(setCache).not.toHaveBeenCalled();
    expect(global.io.emit).not.toHaveBeenCalled();
  });

  test('GET /api/social-media/:id - fetches mock posts and caches', async () => {
    getCache.mockResolvedValueOnce(null);
    setCache.mockResolvedValueOnce();

    const res = await request(app).get(`/api/social-media/${disasterId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ posts: mockPosts });
    expect(getCache).toHaveBeenCalledWith(`social:${disasterId}`);
    expect(setCache).toHaveBeenCalledWith(`social:${disasterId}`, mockPosts);
    expect(global.io.emit).toHaveBeenCalledWith('social_media_updated', {
      disaster_id: disasterId,
      posts: mockPosts
    });
  });
});
