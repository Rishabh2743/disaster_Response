const request = require('supertest');
const app = require('../index');

jest.mock('../utils/gemini', () => ({
  extractLocationFromText: jest.fn(() => Promise.resolve('Manhattan, NYC'))
}));

jest.mock('../utils/geocode', () => ({
  getLatLng: jest.fn(() => Promise.resolve({ lat: 40.7831, lng: -73.9712 }))
}));

jest.mock('../utils/cache', () => ({
  getCache: jest.fn(() => Promise.resolve(null)),
  setCache: jest.fn(() => Promise.resolve())
}));

describe('Geocode API', () => {
  test('POST /api/geocode - should extract location and return coordinates', async () => {
    const res = await request(app)
      .post('/api/geocode')
      .send({ description: 'Flooding in Manhattan due to heavy rains' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      locationName: 'Manhattan, NYC',
      lat: 40.7831,
      lng: -73.9712
    });
  });
});
