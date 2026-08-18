import { Router } from 'express';
import { getCabanas } from '../services/bookingService.js';
import { getMapState } from '../services/mapParser.js';

const router = Router();

router.get('/map', (req, res) => {
  const map = getMapState(); // tiles/width/height/poolBounds, set once at startup
  const cabanas = getCabanas(); // live status, mutated by bookings

  res.json({
    width: map.width,
    height: map.height,
    tiles: map.tiles,
    cabanas,
    poolBounds: map.poolBounds,
  });
});

export default router;