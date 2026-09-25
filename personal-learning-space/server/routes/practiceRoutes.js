import express from 'express';
import { dataStore } from '../services/dataStore.js';

const router = express.Router({ mergeParams: true });

// Get all practice scenarios for subject
router.get('/', (req, res) => {
  try {
    const scenarios = dataStore.getPracticeScenarios(req.params.id);
    res.json({ success: true, data: scenarios });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single scenario
router.get('/:scenarioId', (req, res) => {
  try {
    const scenario = dataStore.getPracticeScenario(req.params.scenarioId);
    if (!scenario) {
      return res.status(404).json({ success: false, error: 'Scenario not found' });
    }
    res.json({ success: true, data: scenario });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Record practice attempt / completion
router.post('/:scenarioId/attempt', (req, res) => {
  try {
    const result = dataStore.recordPracticeAttempt(req.params.scenarioId, {
      subjectId: req.params.id,
      ...req.body
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
