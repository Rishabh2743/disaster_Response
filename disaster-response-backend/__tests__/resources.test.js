const request = require('supertest');
const app = require('../index');

// ✅ Mock Supabase
jest.mock('../utils/supabase', () => ({
  rpc: jest.fn()
}));

// ✅ Mock Socket.IO emitter
global.io = {
  emit: jest.fn()
};

const supabase = require('../utils/supabase');

describe('Resources API', () => {
  const disasterId = 'abc123';
  const lat = 40.7128;
  const lon = -74.0060;

  beforeEach(() => {
    supabase.rpc.mockReset();
    global.io.emit.mockReset();
  });

  test('GET /api/resources/:id - with valid lat/lon', async () => {
    const mockResources = [
      { id: 1, name: 'Shelter A', type: 'shelter' },
      { id: 2, name: 'Food Point B', type: 'food' }
    ];

    supabase.rpc.mockResolvedValueOnce({ data: mockResources, error: null });

    const res = await request(app)
      .get(`/api/resources/${disasterId}`)
      .query({ lat, lon });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockResources);
    expect(supabase.rpc).toHaveBeenCalledWith('find_resources_nearby', {
      center: `SRID=4326;POINT(${lon} ${lat})`,
      distance: 10000
    });
    expect(global.io.emit).toHaveBeenCalledWith('resources_updated', {
      disaster_id: disasterId,
      resources: mockResources
    });
  });

  test('GET /api/resources/:id - missing lat/lon', async () => {
    const res = await request(app).get(`/api/resources/${disasterId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Missing lat/lon');
  });

  test('GET /api/resources/:id - Supabase error', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } });

    const res = await request(app)
      .get(`/api/resources/${disasterId}`)
      .query({ lat, lon });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: { message: 'DB error' } });
  });
});
