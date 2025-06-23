const request = require('supertest');
const app = require('../index');
const axios = require('axios');

jest.mock('axios');

describe('Official Updates API', () => {
  const disasterId = 'mock-id';

  const mockHTML = `
    <html>
      <body>
        <a href="/disaster-relief">Disaster Relief Efforts</a>
        <a href="https://www.example.com/news">Some News</a>
        <a href="/not-related">Irrelevant</a>
      </body>
    </html>
  `;

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: mockHTML
    });
  });

  test('GET /api/updates/:id - fetches and parses new data', async () => {
    const res = await request(app).get(`/api/updates/${disasterId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.updates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: expect.stringContaining('Disaster'),
          url: expect.stringContaining('https://www.redcross.org')
        })
      ])
    );
  });
});
