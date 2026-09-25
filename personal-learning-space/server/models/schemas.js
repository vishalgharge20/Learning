/**
 * MongoDB-ready Model Specifications
 * These define the standard schema contracts for the Personal Learning Space.
 * When Mongoose is attached in future phases, these objects translate 1:1 to mongoose.Schema.
 */

export const SubjectSchema = {
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'CompassOutlined' },
  color: { type: String, default: '#3b82f6' },
  status: { type: String, enum: ['active', 'coming_soon'], default: 'coming_soon' },
  moduleCount: { type: Number, default: 0 },
  conceptCount: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  lastStudiedTopic: { type: String, default: null },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export const ConceptSchema = {
  id: { type: String, required: true, unique: true },
  subjectId: { type: String, required: true },
  moduleId: { type: String, required: true },
  topicId: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  explanation: { type: String, required: true },
  whyItMattersForQa: { type: String, required: true },
  xrExample: { type: String, required: true },
  realWorldExample: { type: String, required: true },
  commonMistakes: [{ type: String }],
  keyTakeaways: [{ type: String }],
  relatedConceptIds: [{ type: String }],
  tags: [{ type: String }],
  order: { type: Number, default: 1 }
};

export const UserProgressSchema = {
  conceptId: { type: String, required: true },
  subjectId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['not_started', 'learning', 'practicing', 'learned', 'needs_review'], 
    default: 'not_started' 
  },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  understandingLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  lastStudiedDate: { type: String, default: null },
  lastPracticedDate: { type: String, default: null },
  recallStrength: { type: Number, min: 0, max: 100, default: 100 },
  attempts: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  consecutiveCorrect: { type: Number, default: 0 },
  mistakesCount: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
};

export const PracticeScenarioSchema = {
  id: { type: String, required: true, unique: true },
  subjectId: { type: String, required: true },
  moduleId: { type: String, required: true },
  conceptId: { type: String, required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  scenario: { type: String, required: true },
  environment: {
    device: { type: String },
    platform: { type: String },
    unityVersion: { type: String },
    buildType: { type: String }
  },
  symptoms: [{ type: String }],
  qaObjective: { type: String, required: true },
  investigationSteps: [{
    order: { type: Number },
    action: { type: String },
    hint: { type: String },
    rationale: { type: String }
  }],
  commonTraps: [{ type: String }],
  modelSolution: { type: String, required: true },
  adbCommands: [{ type: String }]
};

export const QuizSchema = {
  id: { type: String, required: true, unique: true },
  subjectId: { type: String, required: true },
  moduleId: { type: String, required: true },
  conceptId: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['multiple_choice', 'true_false', 'scenario'], default: 'multiple_choice' },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number, required: true }, // Index 0-based
  explanation: { type: String, required: true },
  qaTakeaway: { type: String, required: true }
};

export const BugSchema = {
  id: { type: String, required: true, unique: true },
  subjectId: { type: String, required: true },
  title: { type: String, required: true },
  project: { type: String, required: true },
  build: { type: String, required: true },
  device: { type: String, required: true },
  platform: { type: String, required: true },
  severity: { type: String, enum: ['Critical', 'Major', 'Moderate', 'Minor'], default: 'Major' },
  priority: { type: String, enum: ['P0', 'P1', 'P2', 'P3'], default: 'P1' },
  reproductionRate: { type: String, default: '5/5 (100%)' },
  preconditions: { type: String, default: '' },
  steps: [{ type: String }],
  expected: { type: String, required: true },
  actual: { type: String, required: true },
  logs: { type: String, default: '' },
  rootCause: { type: String, default: '' },
  resolution: { type: String, default: '' },
  lessonsLearned: { type: String, default: '' },
  tags: [{ type: String }],
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
};

export const NoteSchema = {
  id: { type: String, required: true, unique: true },
  subjectId: { type: String, required: true },
  conceptId: { type: String, default: null },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['qa_tip', 'cheat_sheet', 'snippet', 'observation', 'general'], 
    default: 'qa_tip' 
  },
  tags: [{ type: String }],
  updatedAt: { type: String, default: () => new Date().toISOString() }
};
