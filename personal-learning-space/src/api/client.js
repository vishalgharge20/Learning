/**
 * Centralized API Client
 * Wraps backend HTTP requests with consistent error handling and typing.
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || `HTTP error ${res.status}`);
    }
    return json.data;
  } catch (err) {
    console.error(`API Request Error [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Subjects
  getSubjects: () => request('/subjects'),
  getSubject: (id) => request(`/subjects/${id}`),

  // Curriculum & Concepts
  getCurriculum: (subjectId) => request(`/subjects/${subjectId}/curriculum`),
  getConcept: (subjectId, conceptId) => request(`/subjects/${subjectId}/concepts/${conceptId}`),
  updateConceptProgress: (subjectId, conceptId, data) =>
    request(`/subjects/${subjectId}/concepts/${conceptId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Progress & Weak Areas
  getProgress: (subjectId) => request(`/subjects/${subjectId}/progress`),
  getWeakAreas: (subjectId) => request(`/subjects/${subjectId}/weak-areas`),

  // Spaced Recall
  getRecallItems: (subjectId) => request(`/subjects/${subjectId}/recall`),
  reviewRecallItem: (subjectId, conceptId, rating) =>
    request(`/subjects/${subjectId}/recall/review`, {
      method: 'POST',
      body: JSON.stringify({ conceptId, rating })
    }),

  // Practice
  getPracticeScenarios: (subjectId) => request(`/subjects/${subjectId}/practice`),
  getPracticeScenario: (subjectId, scenarioId) => request(`/subjects/${subjectId}/practice/${scenarioId}`),
  recordPracticeAttempt: (subjectId, scenarioId, data) =>
    request(`/subjects/${subjectId}/practice/${scenarioId}/attempt`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Quiz
  getQuizzes: (subjectId) => request(`/subjects/${subjectId}/quizzes`),
  submitQuizAnswer: (subjectId, quizId, selectedOption) =>
    request(`/subjects/${subjectId}/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ selectedOption })
    }),

  // Bugs
  getBugs: (subjectId) => request(`/bugs${subjectId ? `?subjectId=${subjectId}` : ''}`),
  createBug: (data) =>
    request('/bugs', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateBug: (id, data) =>
    request(`/bugs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteBug: (id) =>
    request(`/bugs/${id}`, {
      method: 'DELETE'
    }),

  // Notes
  getNotes: (subjectId) => request(`/notes${subjectId ? `?subjectId=${subjectId}` : ''}`),
  createNote: (data) =>
    request('/notes', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateNote: (id, data) =>
    request(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteNote: (id) =>
    request(`/notes/${id}`, {
      method: 'DELETE'
    }),

  // AI Teacher
  chatAI: ({ prompt, subjectId, conceptId, history }) =>
    request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, subjectId, conceptId, history })
    }),

  // Search
  search: (query) => request(`/search?q=${encodeURIComponent(query)}`)
};
