import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { seedSubjects } from '../seed/subjectsData.js';
import { xrQaCurriculum } from '../seed/xrQaCurriculum.js';
import { initialProgressData } from '../seed/initialProgressData.js';
import { seedPracticeScenarios } from '../seed/practiceData.js';
import { seedQuizzes } from '../seed/quizData.js';
import { seedBugs } from '../seed/bugsData.js';
import { seedNotes } from '../seed/notesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

class DataStore {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORE_FILE)) {
      try {
        const fileContent = fs.readFileSync(STORE_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        console.log('📦 DataStore: Loaded persistent data from store.json');
      } catch (err) {
        console.warn('⚠️ DataStore: Error reading store.json, falling back to seed data:', err.message);
        this.resetToSeed();
      }
    } else {
      this.resetToSeed();
    }
  }

  resetToSeed() {
    this.data = {
      subjects: seedSubjects,
      curriculums: {
        'xr-qa': xrQaCurriculum
      },
      userProgress: initialProgressData,
      practiceScenarios: seedPracticeScenarios,
      quizzes: seedQuizzes,
      bugs: seedBugs,
      notes: seedNotes,
      aiConversations: []
    };
    this.save();
    console.log('🌱 DataStore: Initialized with default seed curriculum & data.');
  }

  save() {
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ DataStore: Failed to persist store.json:', err.message);
    }
  }

  // Subjects
  getSubjects() {
    return this.data.subjects;
  }

  getSubject(id) {
    return this.data.subjects.find(s => s.id === id) || null;
  }

  // Curriculum & Concepts
  getCurriculum(subjectId) {
    return this.data.curriculums[subjectId] || [];
  }

  getAllConcepts(subjectId) {
    const curriculum = this.getCurriculum(subjectId);
    const concepts = [];
    curriculum.forEach(mod => {
      mod.topics?.forEach(top => {
        top.concepts?.forEach(c => {
          concepts.push({
            ...c,
            moduleId: mod.id,
            moduleCode: mod.code,
            moduleTitle: mod.title,
            topicId: top.id,
            topicTitle: top.title,
            subjectId
          });
        });
      });
    });
    return concepts;
  }

  getConcept(subjectId, conceptId) {
    const concepts = this.getAllConcepts(subjectId);
    return concepts.find(c => c.id === conceptId) || null;
  }

  // User Progress
  getUserProgress(subjectId) {
    return this.data.userProgress.filter(p => p.subjectId === subjectId);
  }

  getConceptProgress(subjectId, conceptId) {
    let progress = this.data.userProgress.find(
      p => p.subjectId === subjectId && p.conceptId === conceptId
    );
    if (!progress) {
      progress = {
        conceptId,
        subjectId,
        status: 'not_started',
        progress: 0,
        understandingLevel: 'beginner',
        lastStudiedDate: null,
        lastPracticedDate: null,
        recallStrength: 100,
        attempts: 0,
        correctAnswers: 0,
        consecutiveCorrect: 0,
        mistakesCount: 0,
        notes: ''
      };
      this.data.userProgress.push(progress);
    }
    return progress;
  }

  updateConceptProgress(subjectId, conceptId, updates) {
    let item = this.data.userProgress.find(
      p => p.subjectId === subjectId && p.conceptId === conceptId
    );
    if (!item) {
      item = {
        conceptId,
        subjectId,
        status: 'not_started',
        progress: 0,
        understandingLevel: 'beginner',
        lastStudiedDate: null,
        lastPracticedDate: null,
        recallStrength: 100,
        attempts: 0,
        correctAnswers: 0,
        consecutiveCorrect: 0,
        mistakesCount: 0,
        notes: ''
      };
      this.data.userProgress.push(item);
    }
    Object.assign(item, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return item;
  }

  // Practice
  getPracticeScenarios(subjectId) {
    return this.data.practiceScenarios.filter(p => p.subjectId === subjectId);
  }

  getPracticeScenario(id) {
    return this.data.practiceScenarios.find(p => p.id === id) || null;
  }

  recordPracticeAttempt(scenarioId, { conceptId, subjectId, isCompleted, notes }) {
    if (conceptId && subjectId) {
      const prog = this.getConceptProgress(subjectId, conceptId);
      prog.attempts = (prog.attempts || 0) + 1;
      prog.lastPracticedDate = new Date().toISOString();
      if (isCompleted) {
        prog.progress = Math.min(100, (prog.progress || 0) + 15);
        if (prog.status === 'not_started' || prog.status === 'learning') {
          prog.status = 'practicing';
        }
      }
      this.updateConceptProgress(subjectId, conceptId, prog);
    }
    this.save();
    return { success: true };
  }

  // Quizzes
  getQuizzes(subjectId) {
    return this.data.quizzes.filter(q => q.subjectId === subjectId);
  }

  getQuiz(id) {
    return this.data.quizzes.find(q => q.id === id) || null;
  }

  submitQuizAnswer(quizId, { selectedOption }) {
    const quiz = this.getQuiz(quizId);
    if (!quiz) return null;
    const isCorrect = quiz.correctAnswer === selectedOption;

    if (quiz.conceptId && quiz.subjectId) {
      const prog = this.getConceptProgress(quiz.subjectId, quiz.conceptId);
      prog.attempts = (prog.attempts || 0) + 1;
      prog.lastStudiedDate = new Date().toISOString();
      if (isCorrect) {
        prog.correctAnswers = (prog.correctAnswers || 0) + 1;
        prog.consecutiveCorrect = (prog.consecutiveCorrect || 0) + 1;
        prog.recallStrength = Math.min(100, (prog.recallStrength || 70) + 10);
      } else {
        prog.consecutiveCorrect = 0;
        prog.mistakesCount = (prog.mistakesCount || 0) + 1;
        prog.recallStrength = Math.max(20, (prog.recallStrength || 70) - 15);
        if (prog.status === 'learned') {
          prog.status = 'needs_review';
        }
      }
      this.updateConceptProgress(quiz.subjectId, quiz.conceptId, prog);
    }

    return {
      isCorrect,
      correctAnswer: quiz.correctAnswer,
      explanation: quiz.explanation,
      qaTakeaway: quiz.qaTakeaway
    };
  }

  // Bugs
  getBugs(subjectId) {
    let list = this.data.bugs;
    if (subjectId) {
      list = list.filter(b => b.subjectId === subjectId);
    }
    return list;
  }

  getBug(id) {
    return this.data.bugs.find(b => b.id === id) || null;
  }

  addBug(bugData) {
    const id = `bug-${Date.now().toString(36)}`;
    const newBug = {
      id,
      date: new Date().toISOString().split('T')[0],
      ...bugData
    };
    this.data.bugs.unshift(newBug);
    this.save();
    return newBug;
  }

  updateBug(id, bugData) {
    const idx = this.data.bugs.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.bugs[idx] = { ...this.data.bugs[idx], ...bugData, id };
    this.save();
    return this.data.bugs[idx];
  }

  deleteBug(id) {
    const idx = this.data.bugs.findIndex(b => b.id === id);
    if (idx === -1) return false;
    this.data.bugs.splice(idx, 1);
    this.save();
    return true;
  }

  // Notes
  getNotes(subjectId) {
    let list = this.data.notes;
    if (subjectId) {
      list = list.filter(n => n.subjectId === subjectId);
    }
    return list;
  }

  getNote(id) {
    return this.data.notes.find(n => n.id === id) || null;
  }

  addNote(noteData) {
    const id = `note-${Date.now().toString(36)}`;
    const newNote = {
      id,
      updatedAt: new Date().toISOString(),
      ...noteData
    };
    this.data.notes.unshift(newNote);
    this.save();
    return newNote;
  }

  updateNote(id, noteData) {
    const idx = this.data.notes.findIndex(n => n.id === id);
    if (idx === -1) return null;
    this.data.notes[idx] = { 
      ...this.data.notes[idx], 
      ...noteData, 
      id, 
      updatedAt: new Date().toISOString() 
    };
    this.save();
    return this.data.notes[idx];
  }

  deleteNote(id) {
    const idx = this.data.notes.findIndex(n => n.id === id);
    if (idx === -1) return false;
    this.data.notes.splice(idx, 1);
    this.save();
    return true;
  }

  // Global Search
  searchAll(query) {
    if (!query || typeof query !== 'string') return [];
    const q = query.toLowerCase().trim();
    const results = [];

    // Subjects
    this.data.subjects.forEach(s => {
      if (s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)) {
        results.push({
          type: 'subject',
          id: s.id,
          title: s.title,
          subtitle: s.subtitle,
          url: `/subjects/${s.id}`
        });
      }
    });

    // Concepts & Modules
    Object.keys(this.data.curriculums).forEach(subjId => {
      const curriculum = this.data.curriculums[subjId];
      curriculum.forEach(mod => {
        if (mod.title.toLowerCase().includes(q) || mod.description?.toLowerCase().includes(q)) {
          results.push({
            type: 'module',
            id: mod.id,
            title: `${mod.code}. ${mod.title}`,
            subtitle: `Module in ${subjId.toUpperCase()}`,
            url: `/subjects/${subjId}/learn`
          });
        }

        mod.topics?.forEach(top => {
          top.concepts?.forEach(c => {
            if (
              c.title.toLowerCase().includes(q) ||
              c.summary.toLowerCase().includes(q) ||
              c.explanation.toLowerCase().includes(q) ||
              c.tags?.some(t => t.toLowerCase().includes(q))
            ) {
              results.push({
                type: 'concept',
                id: c.id,
                title: c.title,
                subtitle: `${mod.title} • ${c.difficulty}`,
                url: `/subjects/${subjId}/learn/${c.id}`
              });
            }
          });
        });
      });
    });

    // Notes
    this.data.notes.forEach(n => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
        results.push({
          type: 'note',
          id: n.id,
          title: n.title,
          subtitle: `Note • ${n.category}`,
          url: `/subjects/${n.subjectId}/knowledge`
        });
      }
    });

    // Bugs
    this.data.bugs.forEach(b => {
      if (b.title.toLowerCase().includes(q) || b.rootCause?.toLowerCase().includes(q)) {
        results.push({
          type: 'bug',
          id: b.id,
          title: b.title,
          subtitle: `Bug • ${b.severity} (${b.project})`,
          url: `/subjects/${b.subjectId}/bugs`
        });
      }
    });

    return results.slice(0, 15);
  }
}

export const dataStore = new DataStore();
