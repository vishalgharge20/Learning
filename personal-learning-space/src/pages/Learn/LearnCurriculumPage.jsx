import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ReadOutlined,
  SearchOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  WarningFilled,
  RightOutlined,
  DownOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { api } from '../../api/client.js';
import { StatusBadge, DifficultyTag, ProgressBar, EmptyState } from '../../components/common/Components.jsx';

export function LearnCurriculumPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedModules, setExpandedModules] = useState(['mod-01-qa-fundamentals', 'mod-10-performance-testing', 'mod-11-unity-profiler']);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await api.getCurriculum(subjectId || 'xr-qa');
        setCurriculum(data || []);
      } catch (err) {
        console.error('Error loading curriculum:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [subjectId]);

  const toggleModule = (modId) => {
    setExpandedModules(prev =>
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const filteredCurriculum = curriculum.map(mod => {
    const filteredTopics = mod.topics?.map(topic => {
      const filteredConcepts = topic.concepts?.filter(c => {
        const matchesSearch = 
          !searchFilter ||
          c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
          c.summary.toLowerCase().includes(searchFilter.toLowerCase());
        
        const matchesStatus = 
          statusFilter === 'all' || 
          c.userProgress?.status === statusFilter;

        return matchesSearch && matchesStatus;
      });
      return { ...topic, concepts: filteredConcepts };
    }).filter(t => t.concepts?.length > 0);

    return { ...mod, topics: filteredTopics };
  }).filter(m => m.topics?.length > 0);

  return (
    <div className="page-container" style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: 6 }}>
          XR QA Curriculum
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
          24 structured engineering modules covering graphics pipelines, spatial tracking, Unity internals, and testing strategies.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        gap: 14,
        marginBottom: 28,
        flexWrap: 'wrap',
        background: '#0f1623',
        padding: '14px 18px',
        borderRadius: 10,
        border: '1px solid #1e293b'
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
          <SearchOutlined style={{ position: 'absolute', left: 12, top: 12, color: '#64748b' }} />
          <input
            type="text"
            placeholder="Filter topics or concepts (e.g. Profiler, OpenXR, 6DoF)..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              width: '100%',
              background: '#080c14',
              border: '1px solid #1e293b',
              borderRadius: 8,
              padding: '8px 12px 8px 36px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Concepts' },
            { id: 'learning', label: 'Learning' },
            { id: 'practicing', label: 'Practicing' },
            { id: 'learned', label: 'Learned' },
            { id: 'needs_review', label: 'Needs Review' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              style={{
                background: statusFilter === item.id ? '#2563eb' : '#131c2e',
                border: `1px solid ${statusFilter === item.id ? '#3b82f6' : '#1e293b'}`,
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: statusFilter === item.id ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modules List */}
      {filteredCurriculum.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredCurriculum.map(mod => {
            const isExpanded = expandedModules.includes(mod.id);
            const totalConcepts = mod.topics?.reduce((acc, t) => acc + (t.concepts?.length || 0), 0) || 0;
            const learnedConcepts = mod.topics?.reduce((acc, t) => 
              acc + (t.concepts?.filter(c => c.userProgress?.status === 'learned').length || 0), 0) || 0;
            const progressPercent = totalConcepts > 0 ? Math.round((learnedConcepts / totalConcepts) * 100) : 0;

            return (
              <div
                key={mod.id}
                className="dark-card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  border: isExpanded ? '1px solid #27364f' : '1px solid #1e293b'
                }}
              >
                {/* Module Header Bar */}
                <div
                  onClick={() => toggleModule(mod.id)}
                  style={{
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isExpanded ? '#141d2f' : '#101726',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      backgroundColor: 'rgba(59, 130, 246, 0.12)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 800
                    }}>
                      {mod.code}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                          {mod.title}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          ({totalConcepts} {totalConcepts === 1 ? 'concept' : 'concepts'})
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 90, textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4 }}>
                        {learnedConcepts}/{totalConcepts} Mastered
                      </div>
                      <ProgressBar value={progressPercent} variant="auto" height={5} />
                    </div>
                    {isExpanded ? <DownOutlined style={{ fontSize: 13, color: '#94a3b8' }} /> : <RightOutlined style={{ fontSize: 13, color: '#94a3b8' }} />}
                  </div>
                </div>

                {/* Module Body: Topics & Concepts */}
                {isExpanded && (
                  <div style={{ padding: '20px 24px', backgroundColor: '#0d131f' }}>
                    {mod.topics?.map(topic => (
                      <div key={topic.id} style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                          Topic: {topic.title}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
                          {topic.concepts?.map(c => (
                            <div
                              key={c.id}
                              onClick={() => navigate(`/subjects/${subjectId}/learn/${c.id}`)}
                              style={{
                                padding: '14px 16px',
                                background: '#131c2e',
                                border: '1px solid #1e293b',
                                borderRadius: 8,
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 150ms ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#3b82f6';
                                e.currentTarget.style.backgroundColor = '#17233a';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#1e293b';
                                e.currentTarget.style.backgroundColor = '#131c2e';
                              }}
                            >
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                                    {c.title}
                                  </h4>
                                  <DifficultyTag level={c.difficulty} />
                                </div>
                                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4, margin: '0 0 12px 0' }}>
                                  {c.summary}
                                </p>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #1a2234' }}>
                                <StatusBadge status={c.userProgress?.status || 'not_started'} />
                                <span style={{ fontSize: '0.78rem', color: '#3b82f6', fontWeight: 600 }}>
                                  Study →
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={ReadOutlined}
          title="No concepts found"
          description="Try broadening your search term or selecting 'All Concepts'."
          action={
            <button
              onClick={() => { setSearchFilter(''); setStatusFilter('all'); }}
              style={{
                background: '#2563eb',
                border: 'none',
                color: '#fff',
                padding: '6px 16px',
                borderRadius: 6,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          }
        />
      )}
    </div>
  );
}
