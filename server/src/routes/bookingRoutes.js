import { Router } from 'express';
import { bookCabana } from '../services/bookingService.js';

const router = Router();

router.post('/cabanas/:id/book', (req, res) => {
  const { id } = req.params;
  const { room, guestName } = req.body;

  const result = bookCabana(id, room, guestName);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ success: true, cabana: result.cabana });
});

export default router;