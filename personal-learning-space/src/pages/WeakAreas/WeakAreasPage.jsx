import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ThunderboltOutlined,
  ArrowRightOutlined,
  ExperimentOutlined,
  AimOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useLearning } from '../../context/LearningContext.jsx';
import { DifficultyTag, ProgressBar, EmptyState } from '../../components/common/Components.jsx';

export function WeakAreasPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { weakAreas, stats } = useLearning();

  const totalWeakItems = weakAreas.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="page-container" style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ThunderboltOutlined style={{ fontSize: 18 }} />
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
            Weak Areas & Diagnostic Remediation
          </h1>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
          Concepts where quiz accuracy is low (&lt;60%), memory recall has decayed, or mistakes have been repeatedly logged. Click any concept to review or practice.
        </p>
      </div>

      {totalWeakItems > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {weakAreas.map((group) => (
            <div key={group.moduleTitle} className="dark-card" style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                  {group.moduleTitle}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700, background: 'rgba(239, 68, 68, 0.12)', padding: '2px 8px', borderRadius: 6 }}>
                  {group.items.length} {group.items.length === 1 ? 'Concept Flagged' : 'Concepts Flagged'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {group.items.map((item) => (
                  <div
                    key={item.conceptId}
                    style={{
                      background: '#0a0f18',
                      border: '1px solid #1e293b',
                      borderRadius: 8,
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 16,
                      transition: 'all 150ms ease'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span
                          onClick={() => navigate(`/subjects/${subjectId}/learn/${item.conceptId}`)}
                          style={{
                            fontSize: '1.02rem',
                            fontWeight: 700,
                            color: '#f8fafc',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#f8fafc'}
                        >
                          {item.title}
                        </span>
                        <DifficultyTag level={item.difficulty} />
                      </div>

                      <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        Primary Pitfall: <span style={{ color: '#cbd5e1' }}>{item.primaryTrap}</span>
                        {item.mistakesCount > 0 && (
                          <span style={{ color: '#f87171', marginLeft: 8 }}>({item.mistakesCount} mistakes logged)</span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ textAlign: 'right', minWidth: 100 }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ef4444' }}>
                          {item.score}%
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Retention Score
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => navigate(`/subjects/${subjectId}/practice?conceptId=${item.conceptId}`)}
                          title="Practice Scenarios"
                          style={{
                            background: '#131c2e',
                            border: '1px solid #1e293b',
                            color: '#c4b5fd',
                            padding: '6px 12px',
                            borderRadius: 6,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <ExperimentOutlined />
                          <span>Practice</span>
                        </button>

                        <button
                          onClick={() => navigate(`/subjects/${subjectId}/learn/${item.conceptId}`)}
                          style={{
                            background: '#2563eb',
                            border: 'none',
                            color: '#ffffff',
                            padding: '6px 14px',
                            borderRadius: 6,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <span>Review</span>
                          <ArrowRightOutlined />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckCircleOutlined}
          title="No Weak Areas Identified!"
          description="Your quiz accuracy and recall retention across all studied concepts are in good health. Keep practicing to maintain your mastery!"
          action={
            <button
              onClick={() => navigate(`/subjects/${subjectId}/practice`)}
              style={{
                background: '#2563eb',
                border: 'none',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: 6,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Practice Scenarios
            </button>
          }
        />
      )}
    </div>
  );
}
