import express from 'express';
import { dataStore } from '../services/dataStore.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const query = req.query.q || '';
    const results = dataStore.searchAll(query);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
