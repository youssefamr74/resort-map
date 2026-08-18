import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { parseMap, setMapState } from '../../src/services/mapParser.js';
import { initBookingState } from '../../src/services/bookingService.js';

// W . p
// . . .
// c . .
const rawMap = ['W.p', '...', 'c..'].join('\n');

const guests = [
  { room: '101', guestName: 'Violet Cruz' },
  { room: '102', guestName: 'John Smith' },
];

beforeEach(() => {
  const parsedMap = parseMap(rawMap);
  setMapState(parsedMap);
  initBookingState(parsedMap.cabanas, guests);
});

describe('GET /api/map', () => {
  it('returns 200 with the parsed map shape', async () => {
    const res = await request(app).get('/api/map');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      width: 3,
      height: 3,
      poolBounds: { row: 0, col: 2, rowSpan: 1, colSpan: 1 },
    });
    expect(Array.isArray(res.body.tiles)).toBe(true);
    expect(res.body.cabanas).toEqual([{ id: 'cabana-r0-c0', row: 0, col: 0, status: 'available' }]);
  });
});

describe('POST /api/cabanas/:id/book', () => {
  it('books a cabana for a valid guest', async () => {
    const res = await request(app)
      .post('/api/cabanas/cabana-r0-c0/book')
      .send({ room: '101', guestName: 'Violet Cruz' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.cabana.status).toBe('booked');
  });

  it('rejects an invalid guest', async () => {
    const res = await request(app)
      .post('/api/cabanas/cabana-r0-c0/book')
      .send({ room: '999', guestName: 'Nobody' });

    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
  });

  it('rejects booking an already-booked cabana', async () => {
    await request(app)
      .post('/api/cabanas/cabana-r0-c0/book')
      .send({ room: '101', guestName: 'Violet Cruz' });

    const res = await request(app)
      .post('/api/cabanas/cabana-r0-c0/book')
      .send({ room: '102', guestName: 'John Smith' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('This cabana is already booked.');
  });
});
