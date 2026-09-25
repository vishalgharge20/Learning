import express from 'express';
import { dataStore } from '../services/dataStore.js';

const router = express.Router({ mergeParams: true });

// Get all quizzes for subject
router.get('/', (req, res) => {
  try {
    const quizzes = dataStore.getQuizzes(req.params.id);
    res.json({ success: true, data: quizzes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single quiz
router.get('/:quizId', (req, res) => {
  try {
    const quiz = dataStore.getQuiz(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }
    res.json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Submit quiz answer
router.post('/:quizId/submit', (req, res) => {
  try {
    const { selectedOption } = req.body;
    if (selectedOption === undefined) {
      return res.status(400).json({ success: false, error: 'selectedOption is required' });
    }
    const result = dataStore.submitQuizAnswer(req.params.quizId, { selectedOption });
    if (!result) {
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
