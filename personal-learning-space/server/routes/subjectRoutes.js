import express from 'express';
import { dataStore } from '../services/dataStore.js';
import { progressService } from '../services/progressService.js';

const router = express.Router();

// Get all subjects
router.get('/', (req, res) => {
  try {
    const subjects = dataStore.getSubjects();
    res.json({ success: true, data: subjects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single subject details with summary
router.get('/:id', (req, res) => {
  try {
    const subject = dataStore.getSubject(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    const summary = progressService.getSubjectSummary(req.params.id);
    res.json({ success: true, data: { ...subject, summary } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get curriculum tree for subject
router.get('/:id/curriculum', (req, res) => {
  try {
    const curriculum = dataStore.getCurriculum(req.params.id);
    const progressList = dataStore.getUserProgress(req.params.id);

    // Merge progress info into concepts
    const enriched = curriculum.map(mod => ({
      ...mod,
      topics: mod.topics?.map(top => ({
        ...top,
        concepts: top.concepts?.map(c => {
          const p = progressList.find(item => item.conceptId === c.id);
          return {
            ...c,
            userProgress: p || {
              status: 'not_started',
              progress: 0,
              understandingLevel: 'beginner',
              recallStrength: 100
            }
          };
        })
      }))
    }));

    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single concept with details and user progress
router.get('/:id/concepts/:conceptId', (req, res) => {
  try {
    const concept = dataStore.getConcept(req.params.id, req.params.conceptId);
    if (!concept) {
      return res.status(404).json({ success: false, error: 'Concept not found' });
    }
    const userProgress = dataStore.getConceptProgress(req.params.id, req.params.conceptId);
    res.json({ success: true, data: { ...concept, userProgress } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update user progress on a concept
router.put('/:id/concepts/:conceptId/progress', (req, res) => {
  try {
    const updated = dataStore.updateConceptProgress(
      req.params.id, 
      req.params.conceptId, 
      req.body
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get progress dashboard metrics
router.get('/:id/progress', (req, res) => {
  try {
    const summary = progressService.getSubjectSummary(req.params.id);
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get weak areas list
router.get('/:id/weak-areas', (req, res) => {
  try {
    const weakAreas = progressService.getWeakAreas(req.params.id);
    res.json({ success: true, data: weakAreas });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
