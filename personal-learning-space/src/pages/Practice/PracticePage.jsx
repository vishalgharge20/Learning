import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  ExperimentOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  CodeOutlined,
  DesktopOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { api } from '../../api/client.js';
import { useLearning } from '../../context/LearningContext.jsx';
import { DifficultyTag } from '../../components/common/Components.jsx';

export function PracticePage() {
  const { subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const conceptFilter = searchParams.get('conceptId');
  const { refreshData } = useLearning();

  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealedHints, setRevealedHints] = useState({});
  const [showSolution, setShowSolution] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [completedSuccess, setCompletedSuccess] = useState(false);

  useEffect(() => {
    async function loadScenarios() {
      try {
        setLoading(true);
        const data = await api.getPracticeScenarios(subjectId || 'xr-qa');
        setScenarios(data || []);
        if (data && data.length > 0) {
          if (conceptFilter) {
            const matched = data.find(s => s.conceptId === conceptFilter);
            setSelectedScenario(matched || data[0]);
          } else {
            setSelectedScenario(data[0]);
          }
        }
      } catch (err) {
        console.error('Error loading practice scenarios:', err);
      } finally {
        setLoading(false);
      }
    }
    loadScenarios();
  }, [subjectId, conceptFilter]);

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setRevealedHints({});
    setShowSolution(false);
    setUserNotes('');
    setCompletedSuccess(false);
  };

  const toggleHint = (stepOrder) => {
    setRevealedHints(prev => ({ ...prev, [stepOrder]: !prev[stepOrder] }));
  };

  const handleCompleteAttempt = async () => {
    if (!selectedScenario) return;
    try {
      await api.recordPracticeAttempt(subjectId || 'xr-qa', selectedScenario.id, {
        conceptId: selectedScenario.conceptId,
        isCompleted: true,
        notes: userNotes
      });
      setCompletedSuccess(true);
      refreshData();
    } catch (err) {
      console.error('Failed to record practice attempt:', err);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ padding: '60px 24px', textAlign: 'center', color: '#94a3b8' }}>
        Loading QA practice scenarios...
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 1280 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ExperimentOutlined style={{ color: '#8b5cf6' }} />
          <span>XR QA Scenario Practice</span>
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
          Engage real QA engineering methodology. Diagnose performance drops, controller desyncs, tracking loss, and physics failures.
        </p>
      </div>

      {/* Main Grid: Sidebar Scenario List + Main Scenario Lab */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2.2fr)', gap: 24, alignItems: 'start' }}>
        
        {/* Left: Scenarios List */}
        <div className="dark-card" style={{ padding: '18px 16px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12, paddingLeft: 6 }}>
            Select Investigation ({scenarios.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {scenarios.map((sc) => {
              const isSelected = selectedScenario?.id === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(139, 92, 246, 0.15)' : '#0a0f18',
                    border: `1px solid ${isSelected ? 'rgba(139, 92, 246, 0.35)' : '#1e293b'}`,
                    transition: 'all 150ms ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.72rem', color: isSelected ? '#c4b5fd' : '#64748b', fontWeight: 700 }}>
                      {sc.environment?.device || 'XR Device'}
                    </span>
                    <DifficultyTag level={sc.difficulty} />
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', margin: 0, lineHeight: 1.3 }}>
                    {sc.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Scenario Investigation Lab */}
        {selectedScenario && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Scenario Header & Symptoms Card */}
            <div className="dark-card" style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {selectedScenario.title}
                  </h2>
                </div>
                <DifficultyTag level={selectedScenario.difficulty} />
              </div>

              {/* Scenario Description */}
              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: 18 }}>
                {selectedScenario.scenario}
              </p>

              {/* Environment Telemetry */}
              <div style={{
                background: '#0a0f18',
                border: '1px solid #1e293b',
                borderRadius: 8,
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 12,
                marginBottom: 18
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Device:</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{selectedScenario.environment?.device}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Platform:</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{selectedScenario.environment?.platform}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Engine / Pipeline:</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{selectedScenario.environment?.unityVersion}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Build:</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{selectedScenario.environment?.buildType}</div>
                </div>
              </div>

              {/* Observed Symptoms */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
                  Observed Symptoms
                </span>
                <ul style={{ paddingLeft: 18, margin: '6px 0 0 0' }}>
                  {selectedScenario.symptoms?.map((s, idx) => (
                    <li key={idx} style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: 4 }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* QA Objective */}
              <div style={{ padding: '12px 16px', background: 'rgba(59, 130, 246, 0.1)', borderLeft: '3px solid #3b82f6', borderRadius: '0 8px 8px 0' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase' }}>
                  🎯 QA Objective:
                </span>
                <div style={{ fontSize: '0.88rem', color: '#e2e8f0', marginTop: 2 }}>
                  {selectedScenario.qaObjective}
                </div>
              </div>
            </div>

            {/* Step-by-Step Guided Investigation */}
            <div className="dark-card" style={{ padding: '24px 28px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: 16 }}>
                🛠️ Investigation Protocol & Diagnostic Steps
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {selectedScenario.investigationSteps?.map((step) => {
                  const hintOpen = revealedHints[step.order];
                  return (
                    <div
                      key={step.order}
                      style={{
                        background: '#0d1422',
                        border: '1px solid #1e293b',
                        borderRadius: 8,
                        padding: '14px 16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: '#2563eb',
                            color: '#fff',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700
                          }}>
                            {step.order}
                          </span>
                          <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc' }}>
                            {step.action}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleHint(step.order)}
                          style={{
                            background: hintOpen ? 'rgba(245, 158, 11, 0.15)' : '#17233a',
                            border: `1px solid ${hintOpen ? '#f59e0b' : '#27364f'}`,
                            color: hintOpen ? '#fbbf24' : '#94a3b8',
                            borderRadius: 6,
                            padding: '3px 10px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <BulbOutlined />
                          <span>{hintOpen ? 'Hide Hint' : 'Hint'}</span>
                        </button>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', paddingLeft: 32 }}>
                        {step.rationale}
                      </div>

                      {hintOpen && (
                        <div style={{
                          marginTop: 10,
                          marginLeft: 32,
                          padding: '8px 12px',
                          background: 'rgba(245, 158, 11, 0.08)',
                          border: '1px dashed rgba(245, 158, 11, 0.3)',
                          borderRadius: 6,
                          fontSize: '0.82rem',
                          color: '#fbbf24'
                        }}>
                          💡 <strong>Hint:</strong> {step.hint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ADB Command Box (if applicable) */}
            {selectedScenario.adbCommands?.length > 0 && (
              <div className="dark-card" style={{ padding: '20px 24px', background: '#090e17' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CodeOutlined />
                  <span>Applicable Diagnostic Commands</span>
                </div>
                <pre style={{ margin: 0 }}>
                  {selectedScenario.adbCommands.join('\n')}
                </pre>
              </div>
            )}

            {/* Student Findings & Model Solution Comparison */}
            <div className="dark-card" style={{ padding: '24px 28px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>
                📝 Your QA Hypothesis & Root Cause Diagnosis
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 12 }}>
                Before revealing the model solution, write down your root cause diagnosis and recommended test steps:
              </p>

              <textarea
                rows={4}
                placeholder="What is causing the failure? How would you verify the fix?"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                style={{
                  width: '100%',
                  background: '#080c14',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  outline: 'none',
                  resize: 'vertical',
                  marginBottom: 16
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  style={{
                    background: showSolution ? '#1e293b' : 'rgba(59, 130, 246, 0.15)',
                    border: `1px solid ${showSolution ? '#334155' : 'rgba(59, 130, 246, 0.3)'}`,
                    color: showSolution ? '#94a3b8' : '#60a5fa',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <EyeOutlined />
                  <span>{showSolution ? 'Hide Model Solution' : 'Reveal Model Solution & QA Report'}</span>
                </button>

                <button
                  onClick={handleCompleteAttempt}
                  style={{
                    background: completedSuccess ? '#059669' : '#2563eb',
                    border: 'none',
                    color: '#ffffff',
                    padding: '8px 20px',
                    borderRadius: 8,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <CheckOutlined />
                  <span>{completedSuccess ? 'Attempt Recorded! ✓' : 'Mark Practice Completed'}</span>
                </button>
              </div>

              {/* Revealed Model Solution */}
              {showSolution && (
                <div style={{
                  marginTop: 20,
                  padding: '18px 20px',
                  background: '#0d1525',
                  border: '1px solid #2563eb',
                  borderRadius: 8
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', marginBottom: 8, textTransform: 'uppercase' }}>
                    🏆 Lead QA Model Solution & Defect Triage
                  </div>
                  <pre style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    color: '#e2e8f0',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedScenario.modelSolution}
                  </pre>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
