const request = require('supertest');
const express = require('express');
const app = require('../index'); // or your app instance if exported

describe('Disaster API', () => {
  let disasterId;

  const sampleDisaster = {
    title: "Test Flood",
    location_name: "Manhattan, NYC",
    description: "Heavy flooding in Manhattan",
    tags: ["flood", "test"],
    owner_id: "netrunnerX"
  };

  test('POST /api/disasters - create disaster', async () => {
    const res = await request(app)
      .post('/api/disasters')
      .send(sampleDisaster);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    disasterId = res.body.id;
  });

  test('GET /api/disasters - fetch disasters', async () => {
    const res = await request(app).get('/api/disasters');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/disasters/:id - update disaster', async () => {
    const res = await request(app)
      .put(`/api/disasters/${disasterId}`)
      .send({ title: "Updated Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  test('DELETE /api/disasters/:id - delete disaster', async () => {
    const res = await request(app)
      .delete(`/api/disasters/${disasterId}`);

    expect(res.statusCode).toBe(204);
  });
});
