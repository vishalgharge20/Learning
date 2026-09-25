import express from 'express';
import { aiService } from '../services/aiService.js';
import { dataStore } from '../services/dataStore.js';
import { progressService } from '../services/progressService.js';

const router = express.Router();

// Chat with AI Teacher
router.post('/chat', async (req, res) => {
  try {
    const { prompt, subjectId, conceptId, history } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    // Assemble rich real-time context
    const currentSubjectId = subjectId || 'xr-qa';
    const currentConcept = conceptId ? dataStore.getConcept(currentSubjectId, conceptId) : null;
    const stats = progressService.getSubjectSummary(currentSubjectId);
    const weakAreas = progressService.getWeakAreas(currentSubjectId);

    const context = {
      subjectId: currentSubjectId,
      currentConcept,
      stats,
      weakAreas
    };

    const reply = await aiService.chat({ prompt, context, history: history || [] });
    res.json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Check AI status / provider
router.get('/status', (req, res) => {
  try {
    const status = aiService.getStatus();
    res.json({ success: true, data: status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
