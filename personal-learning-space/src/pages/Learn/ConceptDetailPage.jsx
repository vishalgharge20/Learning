import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ExperimentOutlined,
  AimOutlined,
  RobotOutlined,
  EditOutlined,
  SaveOutlined,
  TagOutlined,
  ReadOutlined
} from '@ant-design/icons';
import { api } from '../../api/client.js';
import { useLearning } from '../../context/LearningContext.jsx';
import { StatusBadge, DifficultyTag, ProgressBar } from '../../components/common/Components.jsx';

export function ConceptDetailPage() {
  const { subjectId, conceptId } = useParams();
  const navigate = useNavigate();
  const { updateProgress } = useLearning();

  const [concept, setConcept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('explanation');
  const [noteContent, setNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSavedMessage, setNoteSavedMessage] = useState(false);

  useEffect(() => {
    async function loadConcept() {
      try {
        setLoading(true);
        const data = await api.getConcept(subjectId || 'xr-qa', conceptId);
        setConcept(data);
        setNoteContent(data?.userProgress?.notes || '');
      } catch (err) {
        console.error('Error loading concept:', err);
      } finally {
        setLoading(false);
      }
    }
    loadConcept();
  }, [subjectId, conceptId]);

  const handleStatusChange = async (newStatus) => {
    if (!concept) return;
    const progressVal = newStatus === 'learned' ? 100 : newStatus === 'practicing' ? 60 : 30;
    const updatedProg = {
      ...concept.userProgress,
      status: newStatus,
      progress: progressVal,
      lastStudiedDate: new Date().toISOString()
    };
    await updateProgress(concept.id, updatedProg);
    setConcept(prev => ({ ...prev, userProgress: updatedProg }));
  };

  const handleSaveNotes = async () => {
    if (!concept) return;
    setIsSavingNote(true);
    try {
      const updatedProg = {
        ...concept.userProgress,
        notes: noteContent,
        lastStudiedDate: new Date().toISOString()
      };
      await updateProgress(concept.id, updatedProg);
      setConcept(prev => ({ ...prev, userProgress: updatedProg }));
      setNoteSavedMessage(true);
      setTimeout(() => setNoteSavedMessage(false), 2500);
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setIsSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ padding: '60px 24px', textAlign: 'center', color: '#94a3b8' }}>
        Loading concept study materials...
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="page-container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2>Concept not found</h2>
        <button
          onClick={() => navigate(`/subjects/${subjectId}/learn`)}
          style={{ marginTop: 16, background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
        >
          Return to Curriculum
        </button>
      </div>
    );
  }

  const userProgress = concept.userProgress || {};

  return (
    <div className="page-container" style={{ maxWidth: 1100 }}>
      {/* Back to Curriculum Nav */}
      <button
        onClick={() => navigate(`/subjects/${subjectId}/learn`)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'transparent',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          fontSize: '0.85rem',
          padding: 0,
          marginBottom: 16
        }}
      >
        <ArrowLeftOutlined />
        <span>Back to Curriculum</span>
      </button>

      {/* Main Concept Header Card */}
      <div className="dark-card" style={{ padding: '28px 32px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                {concept.moduleCode}. {concept.moduleTitle}
              </span>
              <span style={{ color: '#64748b' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {concept.topicTitle}
              </span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              {concept.title}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DifficultyTag level={concept.difficulty} />
            <StatusBadge status={userProgress.status || 'not_started'} />
          </div>
        </div>

        <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 20px 0' }}>
          {concept.summary}
        </p>

        {/* Status Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, paddingTop: 18, borderTop: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Status:</span>
            {['learning', 'practicing', 'learned', 'needs_review'].map(st => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                style={{
                  background: userProgress.status === st ? '#2563eb' : '#0a0f18',
                  border: `1px solid ${userProgress.status === st ? '#3b82f6' : '#1e293b'}`,
                  borderRadius: 6,
                  padding: '4px 10px',
                  color: userProgress.status === st ? '#ffffff' : '#94a3b8',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {st === 'needs_review' ? 'Needs Review' : st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => navigate(`/subjects/${subjectId}/practice?conceptId=${concept.id}`)}
              style={{
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#c4b5fd',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <ExperimentOutlined />
              <span>Practice Scenarios</span>
            </button>

            <button
              onClick={() => navigate(`/subjects/${subjectId}/quiz?conceptId=${concept.id}`)}
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#6ee7b7',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <AimOutlined />
              <span>Test Knowledge</span>
            </button>

            <button
              onClick={() => navigate(`/subjects/${subjectId}/ai-teacher?conceptId=${concept.id}&q=Explain ${encodeURIComponent(concept.title)} in detail with an XR bug example`)}
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#93c5fd',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <RobotOutlined />
              <span>Ask AI Mentor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Structured Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.1fr)', gap: 24, alignItems: 'start' }}>
        
        {/* Left Column: Core Technical Knowledge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Section: Explanation */}
          <div className="dark-card" style={{ padding: '24px 28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📖</span> Technical Explanation
            </h3>
            <div style={{ fontSize: '0.94rem', color: '#cbd5e1', lineHeight: 1.65 }}>
              {concept.explanation}
            </div>
          </div>

          {/* Section: Why it matters for QA */}
          <div className="dark-card" style={{ padding: '24px 28px', borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🎯</span> Why It Matters for QA
            </h3>
            <div style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.65 }}>
              {concept.whyItMattersForQa}
            </div>
          </div>

          {/* Section: XR Example & Real-World Failure */}
          <div className="dark-card" style={{ padding: '24px 28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🥽</span> XR & Production Scenarios
            </h3>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 4 }}>
                Target XR Implementation Example
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
                {concept.xrExample}
              </p>
            </div>

            <div style={{ paddingTop: 14, borderTop: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 4 }}>
                Real-World Production Defect
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
                {concept.realWorldExample}
              </p>
            </div>
          </div>

          {/* Section: Common Pitfalls & Mistakes */}
          {concept.commonMistakes?.length > 0 && (
            <div className="dark-card" style={{ padding: '24px 28px', borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚠️</span> Common Pitfalls & QA Traps
              </h3>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {concept.commonMistakes.map((m, idx) => (
                  <li key={idx} style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: 6 }}>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Right Column: Key Takeaways & Personal Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Section: Key Takeaways */}
          {concept.keyTakeaways?.length > 0 && (
            <div className="dark-card" style={{ padding: '22px 24px', background: '#0e1726' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 12, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💡</span> Key Takeaways
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {concept.keyTakeaways.map((k, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.4 }}>{k}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Personal Notes */}
          <div className="dark-card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <EditOutlined style={{ color: '#3b82f6' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                  My Study Notes
                </h3>
              </div>
              {noteSavedMessage && (
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                  Saved! ✓
                </span>
              )}
            </div>

            <textarea
              rows={6}
              placeholder="Jot down personal observations, test ideas, Unity inspector parameters, or questions..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              style={{
                width: '100%',
                background: '#080c14',
                border: '1px solid #1e293b',
                borderRadius: 8,
                padding: '10px 12px',
                color: '#f8fafc',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical',
                marginBottom: 12
              }}
            />

            <button
              onClick={handleSaveNotes}
              disabled={isSavingNote}
              style={{
                width: '100%',
                background: '#2563eb',
                border: 'none',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                padding: '8px 0',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <SaveOutlined />
              <span>{isSavingNote ? 'Saving...' : 'Save Notes'}</span>
            </button>
          </div>

          {/* Section: Tags */}
          {concept.tags?.length > 0 && (
            <div className="dark-card" style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
                Tags & Categorization
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {concept.tags.map(t => (
                  <span
                    key={t}
                    style={{
                      background: '#0a0f18',
                      border: '1px solid #1e293b',
                      borderRadius: 6,
                      padding: '3px 8px',
                      fontSize: '0.75rem',
                      color: '#94a3b8'
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
