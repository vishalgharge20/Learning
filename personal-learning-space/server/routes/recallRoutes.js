import express from 'express';
import { recallService } from '../services/recallService.js';

const router = express.Router({ mergeParams: true });

// Get items due for recall revision
router.get('/', (req, res) => {
  try {
    const subjectId = req.params.id;
    const items = recallService.getRevisionItems(subjectId);
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Submit review feedback for recall card (again, hard, good, easy)
router.post('/review', (req, res) => {
  try {
    const subjectId = req.params.id;
    const { conceptId, rating } = req.body;
    if (!conceptId || !rating) {
      return res.status(400).json({ success: false, error: 'conceptId and rating are required' });
    }
    const updated = recallService.processReview(subjectId, conceptId, rating);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
