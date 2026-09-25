import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CompassOutlined,
  RadarChartOutlined,
  CodeOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  SearchOutlined,
  SettingOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useSubject } from '../../context/SubjectContext.jsx';
import { useLearning } from '../../context/LearningContext.jsx';
import { ProgressBar } from '../../components/common/Components.jsx';
import { SearchModal } from '../../components/layout/SearchModal.jsx';

export function HomePage() {
  const { subjects, setCurrentSubjectId } = useSubject();
  const { setIsSearchOpen } = useLearning();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSelectSubject = (subject) => {
    if (subject.status === 'active') {
      setCurrentSubjectId(subject.id);
      navigate(`/subjects/${subject.id}`);
    }
  };

  const activeSubjects = subjects.filter(s => s.status === 'active');
  const upcomingSubjects = subjects.filter(s => s.status !== 'active');

  const getIcon = (id) => {
    switch (id) {
      case 'xr-qa': return <RadarChartOutlined style={{ fontSize: 24, color: '#3b82f6' }} />;
      case 'playwright': return <CompassOutlined style={{ fontSize: 24, color: '#10b981' }} />;
      case 'python': return <CodeOutlined style={{ fontSize: 24, color: '#f59e0b' }} />;
      case 'javascript': return <ThunderboltOutlined style={{ fontSize: 24, color: '#eab308' }} />;
      case 'unity': return <AppstoreOutlined style={{ fontSize: 24, color: '#8b5cf6' }} />;
      default: return <CompassOutlined style={{ fontSize: 24, color: '#3b82f6' }} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080c14', color: '#f8fafc' }}>
      {/* Global Header */}
      <header
        style={{
          borderBottom: '1px solid #1e293b',
          backgroundColor: '#0b111c',
          padding: '0 40px',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 16
            }}
          >
            ⚡
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.04em', color: '#f8fafc' }}>
            MY LEARNING SPACE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: 18,
              padding: 6,
              borderRadius: 6
            }}
            title="Search workspace (Ctrl+K)"
          >
            <SearchOutlined />
          </button>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: 18,
              padding: 6,
              borderRadius: 6
            }}
            title="Settings"
          >
            <SettingOutlined />
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 10px',
              borderRadius: 20,
              background: '#131c2e',
              border: '1px solid #1e293b'
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                color: '#fff',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}
            >
              V
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Vishal</span>
          </div>
        </div>
      </header>

      {/* Main Home Content */}
      <main style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px' }}>
        {/* User Greeting */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: 8 }}>
            {getGreeting()}, Vishal 👋
          </h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: 640 }}>
            Welcome to your personal technical mastery headquarters. Continue your active track or explore upcoming technical specializations.
          </p>
        </div>

        {/* Section: Continue Learning */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Continue Learning
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              1 Active Specialization
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {activeSubjects.map((subj) => (
              <div
                key={subj.id}
                onClick={() => handleSelectSubject(subj)}
                className="dark-card clickable-card"
                style={{
                  padding: '24px 28px',
                  border: '1px solid #27364f',
                  background: 'linear-gradient(180deg, #131c2e 0%, #0f1623 100%)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        backgroundColor: 'rgba(59, 130, 246, 0.12)',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getIcon(subj.id)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                        {subj.title}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        {subj.subtitle}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 10,
                      textTransform: 'uppercase'
                    }}
                  >
                    Active
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: 20 }}>
                  {subj.description}
                </p>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                    <span style={{ color: '#94a3b8' }}>Overall Progress</span>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>{subj.progress || 35}%</span>
                  </div>
                  <ProgressBar value={subj.progress || 35} variant="primary" height={7} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {subj.moduleCount} Modules • 140+ Concepts
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: '#3b82f6',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    <span>Continue</span>
                    <ArrowRightOutlined />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Other Subjects */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Other Subjects
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Curriculum in development
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {upcomingSubjects.map((subj) => (
              <div
                key={subj.id}
                className="dark-card"
                style={{
                  padding: '20px 22px',
                  opacity: 0.75,
                  border: '1px dashed #1e293b',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        backgroundColor: '#0f1623',
                        border: '1px solid #1e293b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getIcon(subj.id)}
                    </div>
                    <span
                      style={{
                        background: 'rgba(148, 163, 184, 0.1)',
                        color: '#94a3b8',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '1px 7px',
                        borderRadius: 8
                      }}
                    >
                      Coming soon
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4, color: '#f8fafc' }}>
                    {subj.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 10 }}>
                    {subj.subtitle}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    {subj.description}
                  </p>
                </div>

                <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid #1a2234', fontSize: '0.75rem', color: '#64748b' }}>
                  {subj.moduleCount} planned modules
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SearchModal />
    </div>
  );
}
