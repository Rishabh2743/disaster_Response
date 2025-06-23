const request = require('supertest');
const app = require('../index');

jest.mock('axios');
jest.mock('../utils/cache', () => ({
  getCache: jest.fn(),
  setCache: jest.fn()
}));

const axios = require('axios');
const { getCache, setCache } = require('../utils/cache');

describe('Image Verification API', () => {
  const disasterId = 'test123';
  const imageUrl = 'http://example.com/flood.jpg';
  const cacheKey = `verify:${imageUrl}`;

  beforeEach(() => {
    getCache.mockReset();
    setCache.mockReset();
    axios.post.mockReset();
  });

  test('POST /api/verify-image/:id - returns cached verification result', async () => {
    getCache.mockResolvedValueOnce({ verification: 'Looks authentic' });

    const res = await request(app)
      .post(`/api/verify-image/${disasterId}`)
      .send({ image_url: imageUrl });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ fromCache: true, verification: 'Looks authentic' });
    expect(getCache).toHaveBeenCalledWith(cacheKey);
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('POST /api/verify-image/:id - performs Gemini verification and caches', async () => {
    getCache.mockResolvedValueOnce(null);

    axios.post.mockResolvedValueOnce({
      data: {
        candidates: [
          {
            content: {
              parts: [{ text: 'Image appears to show real flood damage.' }]
            }
          }
        ]
      }
    });

    const res = await request(app)
      .post(`/api/verify-image/${disasterId}`)
      .send({ image_url: imageUrl });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ verification: 'Image appears to show real flood damage.' });
    expect(setCache).toHaveBeenCalledWith(cacheKey, {
      verification: 'Image appears to show real flood damage.'
    });
  });

  test('POST /api/verify-image/:id - handles Gemini API error', async () => {
    getCache.mockResolvedValueOnce(null);
    axios.post.mockRejectedValueOnce(new Error('Gemini service down'));

    const res = await request(app)
      .post(`/api/verify-image/${disasterId}`)
      .send({ image_url: imageUrl });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Image verification failed');
    expect(res.body).toHaveProperty('details', 'Gemini service down');
  });
});
