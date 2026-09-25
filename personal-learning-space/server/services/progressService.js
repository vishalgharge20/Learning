import { dataStore } from './dataStore.js';
import { recallService } from './recallService.js';

class ProgressService {
  getSubjectSummary(subjectId) {
    const curriculum = dataStore.getCurriculum(subjectId);
    const concepts = dataStore.getAllConcepts(subjectId);
    const userProgress = dataStore.getUserProgress(subjectId);
    const quizzes = dataStore.getQuizzes(subjectId);
    const practiceScenarios = dataStore.getPracticeScenarios(subjectId);

    const totalConcepts = concepts.length;
    let learnedCount = 0;
    let practicingCount = 0;
    let learningCount = 0;
    let needsReviewCount = 0;
    let notStartedCount = 0;

    let totalProgressSum = 0;
    let totalRecallSum = 0;
    let assessedCount = 0;

    concepts.forEach(concept => {
      const p = userProgress.find(item => item.conceptId === concept.id);
      if (!p || p.status === 'not_started') {
        notStartedCount++;
      } else {
        totalProgressSum += (p.progress || 0);
        assessedCount++;
        const currentRecall = recallService.calculateRecallStrength(p, concept.difficulty);
        totalRecallSum += currentRecall;

        if (p.status === 'learned') learnedCount++;
        else if (p.status === 'practicing') practicingCount++;
        else if (p.status === 'learning') learningCount++;
        else if (p.status === 'needs_review') needsReviewCount++;
      }
    });

    const overallProgress = totalConcepts > 0 
      ? Math.round(totalProgressSum / totalConcepts) 
      : 0;

    const averageKnowledgeStrength = assessedCount > 0
      ? Math.round(totalRecallSum / assessedCount)
      : 100;

    // Module progress breakdown
    const moduleProgress = curriculum.map(mod => {
      let modConceptsCount = 0;
      let modProgressSum = 0;
      let modLearned = 0;

      mod.topics?.forEach(t => {
        t.concepts?.forEach(c => {
          modConceptsCount++;
          const p = userProgress.find(item => item.conceptId === c.id);
          if (p) {
            modProgressSum += (p.progress || 0);
            if (p.status === 'learned') modLearned++;
          }
        });
      });

      const percentage = modConceptsCount > 0 
        ? Math.round(modProgressSum / modConceptsCount) 
        : 0;

      return {
        moduleId: mod.id,
        code: mod.code,
        title: mod.title,
        icon: mod.icon,
        totalConcepts: modConceptsCount,
        learnedConcepts: modLearned,
        progress: percentage
      };
    });

    // Quiz stats
    let totalAttempts = 0;
    let correctAnswers = 0;
    userProgress.forEach(p => {
      totalAttempts += (p.attempts || 0);
      correctAnswers += (p.correctAnswers || 0);
    });
    const quizAccuracy = totalAttempts > 0 
      ? Math.round((correctAnswers / totalAttempts) * 100) 
      : 0;

    // Weak areas calculation
    const weakAreas = this.getWeakAreas(subjectId);

    // Active learning concept for Continue Learning Card
    let activeConcept = null;
    const inProgressItems = userProgress
      .filter(p => p.status === 'learning' || p.status === 'practicing')
      .sort((a, b) => (b.progress || 0) - (a.progress || 0));

    if (inProgressItems.length > 0) {
      const topItem = inProgressItems[0];
      const matchedConcept = concepts.find(c => c.id === topItem.conceptId);
      if (matchedConcept) {
        activeConcept = {
          conceptId: matchedConcept.id,
          title: matchedConcept.title,
          summary: matchedConcept.summary,
          moduleTitle: matchedConcept.moduleTitle,
          progress: topItem.progress || 75,
          status: topItem.status
        };
      }
    }

    // Default to Unity Profiler if none found
    if (!activeConcept) {
      activeConcept = {
        conceptId: 'concept-unity-profiler-cpu',
        title: 'Unity Profiler',
        summary: 'CPU Usage, Timeline View & Bottleneck Analysis',
        moduleTitle: '11. Unity Profiler',
        progress: 75,
        status: 'learning'
      };
    }

    return {
      subjectId,
      overallProgress,
      knowledgeStrength: averageKnowledgeStrength,
      learningStreakDays: 5,
      activeConcept,
      counts: {
        total: totalConcepts,
        learned: learnedCount,
        practicing: practicingCount,
        learning: learningCount,
        needsReview: needsReviewCount,
        notStarted: notStartedCount,
        quizzesTotal: quizzes.length,
        practiceTotal: practiceScenarios.length
      },
      quizStats: {
        accuracy: quizAccuracy,
        totalAttempts,
        correctAnswers
      },
      moduleProgress,
      weakAreasCount: weakAreas.length
    };
  }

  getWeakAreas(subjectId) {
    const concepts = dataStore.getAllConcepts(subjectId);
    const userProgress = dataStore.getUserProgress(subjectId);
    const weakList = [];

    concepts.forEach(concept => {
      const p = userProgress.find(item => item.conceptId === concept.id);
      if (!p || p.status === 'not_started') return;

      const recall = recallService.calculateRecallStrength(p, concept.difficulty);
      const isWeak = 
        p.status === 'needs_review' ||
        recall < 60 ||
        (p.progress > 0 && p.progress < 60) ||
        (p.mistakesCount > 1);

      if (isWeak) {
        // Calculate a composite mastery score (0-100)
        const compositeScore = Math.round(
          (p.progress * 0.4) + 
          (recall * 0.4) + 
          (Math.max(0, 100 - (p.mistakesCount || 0) * 20) * 0.2)
        );

        weakList.push({
          conceptId: concept.id,
          title: concept.title,
          moduleId: concept.moduleId,
          moduleTitle: concept.moduleTitle,
          difficulty: concept.difficulty,
          score: Math.min(60, compositeScore),
          recallStrength: recall,
          mistakesCount: p.mistakesCount || 0,
          status: p.status,
          primaryTrap: concept.commonMistakes?.[0] || 'Need to review core parameters'
        });
      }
    });

    // Group by Module
    const grouped = {};
    weakList.forEach(item => {
      if (!grouped[item.moduleTitle]) {
        grouped[item.moduleTitle] = [];
      }
      grouped[item.moduleTitle].push(item);
    });

    return Object.keys(grouped).map(moduleTitle => ({
      moduleTitle,
      items: grouped[moduleTitle].sort((a, b) => a.score - b.score)
    }));
  }
}

export const progressService = new ProgressService();
