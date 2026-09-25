import { dataStore } from './dataStore.js';

class RecallService {
  /**
   * Deterministic Spaced Repetition calculation
   */
  calculateRecallStrength(progress, difficulty = 'intermediate') {
    if (!progress.lastStudiedDate && !progress.lastPracticedDate) {
      return 100;
    }

    const lastDateStr = progress.lastStudiedDate || progress.lastPracticedDate;
    const lastDate = new Date(lastDateStr);
    const now = new Date();
    const daysElapsed = Math.max(0, (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    // Base memory half-life in days
    let baseHalfLife = 4;
    if (difficulty === 'beginner') baseHalfLife = 6;
    if (difficulty === 'advanced') baseHalfLife = 2.5;

    // Bonus days per consecutive correct answer
    const consecutiveBonus = (progress.consecutiveCorrect || 0) * 2;
    const effectiveHalfLife = baseHalfLife + consecutiveBonus;

    // Exponential decay curve
    const initialStrength = progress.recallStrength || 100;
    let decayedStrength = Math.round(initialStrength * Math.pow(0.5, daysElapsed / effectiveHalfLife));

    // Penalty for mistakes
    const mistakePenalty = (progress.mistakesCount || 0) * 4;
    decayedStrength = Math.max(10, Math.min(100, decayedStrength - mistakePenalty));

    return decayedStrength;
  }

  getRevisionItems(subjectId) {
    const concepts = dataStore.getAllConcepts(subjectId);
    const userProgressList = dataStore.getUserProgress(subjectId);

    const items = [];

    concepts.forEach(concept => {
      const progress = userProgressList.find(p => p.conceptId === concept.id);
      if (!progress || progress.status === 'not_started') return;

      const currentStrength = this.calculateRecallStrength(progress, concept.difficulty);
      const isDue = 
        progress.status === 'needs_review' || 
        currentStrength < 70 ||
        (progress.lastStudiedDate && (Date.now() - new Date(progress.lastStudiedDate).getTime()) > 3 * 24 * 3600 * 1000);

      if (isDue) {
        let urgency = 'medium';
        if (currentStrength < 50 || progress.status === 'needs_review') urgency = 'high';
        if (currentStrength > 65) urgency = 'low';

        items.push({
          conceptId: concept.id,
          title: concept.title,
          moduleId: concept.moduleId,
          moduleTitle: concept.moduleTitle,
          difficulty: concept.difficulty,
          status: progress.status,
          recallStrength: currentStrength,
          lastStudiedDate: progress.lastStudiedDate,
          urgency,
          promptQuestion: `How would an XR QA engineer verify and isolate issues with ${concept.title}?`,
          summary: concept.summary,
          keyTakeaways: concept.keyTakeaways || [],
          commonMistakes: concept.commonMistakes || []
        });
      }
    });

    // Sort by lowest recall strength first
    items.sort((a, b) => a.recallStrength - b.recallStrength);

    return items;
  }

  processReview(subjectId, conceptId, rating) {
    const progress = dataStore.getConceptProgress(subjectId, conceptId);
    const now = new Date().toISOString();

    progress.lastStudiedDate = now;
    progress.attempts = (progress.attempts || 0) + 1;

    switch (rating) {
      case 'again': // Forgot completely
        progress.recallStrength = 30;
        progress.consecutiveCorrect = 0;
        progress.mistakesCount = (progress.mistakesCount || 0) + 1;
        progress.status = 'needs_review';
        break;

      case 'hard': // Recalled with difficulty
        progress.recallStrength = Math.min(100, (progress.recallStrength || 50) + 15);
        progress.consecutiveCorrect = Math.max(1, progress.consecutiveCorrect || 1);
        break;

      case 'good': // Recalled well
        progress.recallStrength = Math.min(100, (progress.recallStrength || 50) + 25);
        progress.consecutiveCorrect = (progress.consecutiveCorrect || 0) + 1;
        if (progress.status === 'needs_review') {
          progress.status = 'learned';
        }
        break;

      case 'easy': // Instant effortless recall
        progress.recallStrength = 100;
        progress.consecutiveCorrect = (progress.consecutiveCorrect || 0) + 2;
        progress.status = 'learned';
        break;

      default:
        break;
    }

    dataStore.updateConceptProgress(subjectId, conceptId, progress);
    return progress;
  }
}

export const recallService = new RecallService();
