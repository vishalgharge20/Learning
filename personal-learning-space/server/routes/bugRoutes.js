import express from 'express';
import { dataStore } from '../services/dataStore.js';

const router = express.Router();

// Get all bugs (optional ?subjectId=)
router.get('/', (req, res) => {
  try {
    const bugs = dataStore.getBugs(req.query.subjectId);
    res.json({ success: true, data: bugs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single bug
router.get('/:id', (req, res) => {
  try {
    const bug = dataStore.getBug(req.params.id);
    if (!bug) {
      return res.status(404).json({ success: false, error: 'Bug not found' });
    }
    res.json({ success: true, data: bug });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create new bug
router.post('/', (req, res) => {
  try {
    const newBug = dataStore.addBug(req.body);
    res.status(201).json({ success: true, data: newBug });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update bug
router.put('/:id', (req, res) => {
  try {
    const updated = dataStore.updateBug(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Bug not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete bug
router.delete('/:id', (req, res) => {
  try {
    const success = dataStore.deleteBug(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Bug not found' });
    }
    res.json({ success: true, message: 'Bug deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
