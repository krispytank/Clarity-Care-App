import express from 'express';
import { protect } from './auth.js';

const router = express.Router();

router.get('/messages/:appointmentId', protect, async (req, res) => {
  try {
    const messages = [];
    res.json({
      status: 'success',
      data: { messages }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;