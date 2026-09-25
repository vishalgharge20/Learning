import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRightOutlined,
  RetweetOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RightOutlined,
  FireOutlined,
  TrophyOutlined,
  SendOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { useSubject } from '../../context/SubjectContext.jsx';
import { useLearning } from '../../context/LearningContext.jsx';
import { ProgressBar, MetricCard, StatusBadge } from '../../components/common/Components.jsx';

export function DashboardPage() {
  const { currentSubject } = useSubject();
  const { stats, recallItems, weakAreas } = useLearning();
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [aiQuestion, setAiQuestion] = useState('');

  const activeConcept = stats?.activeConcept || {
    conceptId: 'concept-unity-profiler-cpu',
    title: 'Unity Profiler',
    summary: 'CPU Usage, Timeline View & Bottleneck Analysis',
    moduleTitle: '11. Unity Profiler',
    progress: 75
  };

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (aiQuestion.trim()) {
      navigate(`/subjects/${subjectId || 'xr-qa'}/ai-teacher?q=${encodeURIComponent(aiQuestion.trim())}`);
    }
  };

  const handleQuickPrompt = (prompt) => {
    navigate(`/subjects/${subjectId || 'xr-qa'}/ai-teacher?q=${encodeURIComponent(prompt)}`);
  };

  const todayRevisions = recallItems.slice(0, 3);
  const topWeakAreas = weakAreas.flatMap(g => g.items).slice(0, 3);

  return (
    <div className="page-container" style={{ maxWidth: 1320 }}>
      {/* Greeting Banner */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: 4 }}>
            Good morning, Vishal 👋
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#94a3b8' }}>
            {currentSubject?.subtitle || 'XR / AR / VR Quality Assurance'} • 5 Day Learning Streak 🔥
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            background: '#131c2e',
            border: '1px solid #1e293b',
            padding: '8px 16px',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <FireOutlined style={{ color: '#f59e0b', fontSize: 18 }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Streak</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>5 Days</div>
            </div>
          </div>

          <div style={{
            background: '#131c2e',
            border: '1px solid #1e293b',
            padding: '8px 16px',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <TrophyOutlined style={{ color: '#10b981', fontSize: 18 }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Knowledge</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{stats?.knowledgeStrength || 85}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>
        
        {/* Left Column: Continue Learning + AI Teacher + Modules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Section: Continue Learning Card */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Continue Learning
            </div>

            <div
              className="dark-card clickable-card"
              onClick={() => navigate(`/subjects/${subjectId}/learn/${activeConcept.conceptId}`)}
              style={{
                padding: '24px 28px',
                border: '1px solid #27364f',
                background: 'linear-gradient(135deg, #131c2e 0%, #162035 100%)',
                boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.45)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase' }}>
                    {activeConcept.moduleTitle || 'Current Module'}
                  </span>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', marginTop: 2, marginBottom: 6 }}>
                    {activeConcept.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, maxWidth: 520 }}>
                    {activeConcept.summary}
                  </p>
                </div>
                <StatusBadge status={activeConcept.status || 'learning'} />
              </div>

              {/* Progress representation */}
              <div style={{ margin: '20px 0 16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                  <span style={{ color: '#94a3b8' }}>Module Mastery</span>
                  <span style={{ color: '#f8fafc', fontWeight: 700 }}>{activeConcept.progress}%</span>
                </div>
                <ProgressBar value={activeConcept.progress} variant="primary" height={8} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, color: '#3b82f6', fontWeight: 600, fontSize: '0.92rem' }}>
                <span>Continue</span>
                <ArrowRightOutlined />
              </div>
            </div>
          </div>

          {/* Section: Ask your AI Teacher */}
          <div className="dark-card" style={{ padding: '22px 24px', background: '#0e1726', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <RobotOutlined style={{ fontSize: 15 }} />
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Ask your AI Teacher...
              </span>
            </div>

            <form onSubmit={handleAiSubmit} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <input
                type="text"
                placeholder="Ask about Unity Profiler, OpenXR bindings, ADB commands, or test scenarios..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                style={{
                  flex: 1,
                  background: '#080c14',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#2563eb',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0 18px',
                  color: '#ffffff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>Ask</span>
                <SendOutlined style={{ fontSize: 13 }} />
              </button>
            </form>

            {/* Quick Prompt Chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                'Explain Unity CPU vs GPU bottlenecks',
                'Give me a tough practice scenario',
                'What am I forgetting?',
                'Essential ADB commands for Logcat'
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleQuickPrompt(prompt)}
                  style={{
                    background: '#131c2e',
                    border: '1px solid #1e293b',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: '0.78rem',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.color = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1e293b';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  ⚡ {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Key Curriculum Modules Breakdown */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Core Curriculum Highlights
              </span>
              <button
                onClick={() => navigate(`/subjects/${subjectId}/learn`)}
                style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}
              >
                View all 24 Modules →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              {(stats?.moduleProgress?.slice(0, 4) || []).map(mod => (
                <div
                  key={mod.moduleId}
                  onClick={() => navigate(`/subjects/${subjectId}/learn`)}
                  className="dark-card clickable-card"
                  style={{ padding: '16px 18px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                      MODULE {mod.code}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                      {mod.progress}%
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: 10, color: '#f8fafc' }}>
                    {mod.title}
                  </h4>
                  <ProgressBar value={mod.progress} variant="auto" height={5} />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Today's Revision + Weak Areas + Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Section: Today's Revision */}
          <div className="dark-card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RetweetOutlined style={{ color: '#f59e0b', fontSize: 16 }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                  Today's Revision
                </h3>
              </div>
              <button
                onClick={() => navigate(`/subjects/${subjectId}/recall`)}
                style={{ background: 'transparent', border: 'none', color: '#f59e0b', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Review All →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {todayRevisions.length > 0 ? (
                todayRevisions.map(item => (
                  <div
                    key={item.conceptId}
                    onClick={() => navigate(`/subjects/${subjectId}/learn/${item.conceptId}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: '#0a0f18',
                      borderRadius: 8,
                      border: '1px solid #1e293b',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                        • {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {item.moduleTitle}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: item.recallStrength < 50 ? '#ef4444' : '#f59e0b'
                    }}>
                      {item.recallStrength}% retention
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '16px 0' }}>
                  All scheduled revisions completed for today! 🎉
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(`/subjects/${subjectId}/recall`)}
              style={{
                width: '100%',
                marginTop: 16,
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                fontWeight: 600,
                fontSize: '0.85rem',
                padding: '9px 0',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              Start Revision Session
            </button>
          </div>

          {/* Section: Weak Areas Quick List */}
          <div className="dark-card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ThunderboltOutlined style={{ color: '#ef4444', fontSize: 16 }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                  Weak Areas
                </h3>
              </div>
              <button
                onClick={() => navigate(`/subjects/${subjectId}/weak-areas`)}
                style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Deep Dive →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topWeakAreas.map(item => (
                <div
                  key={item.conceptId}
                  onClick={() => navigate(`/subjects/${subjectId}/learn/${item.conceptId}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: '#0a0f18',
                    border: '1px solid #1e293b',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {item.moduleTitle}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.12)',
                    padding: '2px 8px',
                    borderRadius: 6
                  }}>
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Quick Workspace Actions */}
          <div className="dark-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12 }}>
              Quick Navigation
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                onClick={() => navigate(`/subjects/${subjectId}/practice`)}
                style={{
                  background: '#0a0f18',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '12px 10px',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ color: '#8b5cf6', fontSize: 16, marginBottom: 4 }}>🧪</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Practice</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>QA Scenarios</div>
              </button>

              <button
                onClick={() => navigate(`/subjects/${subjectId}/quiz`)}
                style={{
                  background: '#0a0f18',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '12px 10px',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ color: '#10b981', fontSize: 16, marginBottom: 4 }}>🎯</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Quiz</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Knowledge Check</div>
              </button>

              <button
                onClick={() => navigate(`/subjects/${subjectId}/bugs`)}
                style={{
                  background: '#0a0f18',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '12px 10px',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ color: '#ef4444', fontSize: 16, marginBottom: 4 }}>🐛</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Bug Journal</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Real XR Defects</div>
              </button>

              <button
                onClick={() => navigate(`/subjects/${subjectId}/knowledge`)}
                style={{
                  background: '#0a0f18',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '12px 10px',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ color: '#3b82f6', fontSize: 16, marginBottom: 4 }}>📖</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Knowledge</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Notes & Snippets</div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
