import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LineChartOutlined,
  FireOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  AimOutlined,
  ExperimentOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useLearning } from '../../context/LearningContext.jsx';
import { MetricCard, ProgressBar } from '../../components/common/Components.jsx';

export function ProgressPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { stats } = useLearning();

  const counts = stats?.counts || {
    total: 24,
    learned: 5,
    practicing: 2,
    learning: 2,
    needsReview: 2,
    notStarted: 13
  };

  const quizStats = stats?.quizStats || {
    accuracy: 75,
    totalAttempts: 12,
    correctAnswers: 9
  };

  return (
    <div className="page-container" style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <LineChartOutlined style={{ color: '#3b82f6' }} />
          <span>Progress & Mastery Dashboard</span>
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
          Quantitative telemetry of your XR QA engineering path: module mastery, retention metrics, and test accuracy.
        </p>
      </div>

      {/* Top 4 Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <MetricCard
          title="Overall Mastery"
          value={`${stats?.overallProgress || 35}%`}
          subtitle="Curriculum completion"
          icon={TrophyOutlined}
          color="#3b82f6"
        />

        <MetricCard
          title="Knowledge Strength"
          value={`${stats?.knowledgeStrength || 85}%`}
          subtitle="Memory retention index"
          icon={CheckCircleOutlined}
          color="#10b981"
        />

        <MetricCard
          title="Learning Streak"
          value={`${stats?.learningStreakDays || 5} Days`}
          subtitle="Consecutive study days"
          icon={FireOutlined}
          color="#f59e0b"
        />

        <MetricCard
          title="Quiz Accuracy"
          value={`${quizStats.accuracy}%`}
          subtitle={`${quizStats.correctAnswers} of ${quizStats.totalAttempts} answered correctly`}
          icon={AimOutlined}
          color="#8b5cf6"
        />
      </div>

      {/* Concept Status Distribution Bar */}
      <div className="dark-card" style={{ padding: '24px 28px', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
            Concept Lifecycle Distribution
          </h3>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            {counts.total} Concepts Tracked
          </span>
        </div>

        {/* Multi-segment stacked progress representation */}
        <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 18, background: '#0a0f18' }}>
          <div style={{ width: `${(counts.learned / counts.total) * 100}%`, background: '#10b981' }} title={`Learned: ${counts.learned}`} />
          <div style={{ width: `${(counts.practicing / counts.total) * 100}%`, background: '#8b5cf6' }} title={`Practicing: ${counts.practicing}`} />
          <div style={{ width: `${(counts.learning / counts.total) * 100}%`, background: '#3b82f6' }} title={`Learning: ${counts.learning}`} />
          <div style={{ width: `${(counts.needsReview / counts.total) * 100}%`, background: '#f59e0b' }} title={`Needs Review: ${counts.needsReview}`} />
          <div style={{ width: `${(counts.notStarted / counts.total) * 100}%`, background: '#1e293b' }} title={`Not Started: ${counts.notStarted}`} />
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span style={{ color: '#94a3b8' }}>Learned:</span>
            <strong style={{ color: '#f8fafc' }}>{counts.learned}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
            <span style={{ color: '#94a3b8' }}>Practicing:</span>
            <strong style={{ color: '#f8fafc' }}>{counts.practicing}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#3b82f6' }} />
            <span style={{ color: '#94a3b8' }}>Learning:</span>
            <strong style={{ color: '#f8fafc' }}>{counts.learning}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <span style={{ color: '#94a3b8' }}>Needs Review:</span>
            <strong style={{ color: '#f8fafc' }}>{counts.needsReview}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#64748b' }} />
            <span style={{ color: '#94a3b8' }}>Not Started:</span>
            <strong style={{ color: '#f8fafc' }}>{counts.notStarted}</strong>
          </div>
        </div>
      </div>

      {/* Module Breakdown List */}
      <div className="dark-card" style={{ padding: '24px 28px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 16px 0', color: '#f8fafc' }}>
          Module-by-Module Progress Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {(stats?.moduleProgress || []).map((mod) => (
            <div
              key={mod.moduleId}
              onClick={() => navigate(`/subjects/${subjectId}/learn`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#0a0f18',
                borderRadius: 8,
                border: '1px solid #1e293b',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e293b'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 240 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', minWidth: 26 }}>
                  {mod.code}
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc' }}>
                  {mod.title}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20, width: 220 }}>
                <div style={{ flex: 1 }}>
                  <ProgressBar value={mod.progress} variant="auto" height={6} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', minWidth: 40, textAlign: 'right' }}>
                  {mod.progress}%
                </span>
                <RightOutlined style={{ fontSize: 11, color: '#64748b' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
