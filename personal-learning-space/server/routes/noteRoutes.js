import express from 'express';
import { dataStore } from '../services/dataStore.js';

const router = express.Router();

// Get all notes (optional ?subjectId=)
router.get('/', (req, res) => {
  try {
    const notes = dataStore.getNotes(req.query.subjectId);
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single note
router.get('/:id', (req, res) => {
  try {
    const note = dataStore.getNote(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create new note
router.post('/', (req, res) => {
  try {
    const newNote = dataStore.addNote(req.body);
    res.status(201).json({ success: true, data: newNote });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update note
router.put('/:id', (req, res) => {
  try {
    const updated = dataStore.updateNote(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete note
router.delete('/:id', (req, res) => {
  try {
    const success = dataStore.deleteNote(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
