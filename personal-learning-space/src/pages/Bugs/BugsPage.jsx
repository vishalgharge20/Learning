import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  BugOutlined,
  PlusOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  DownOutlined,
  RightOutlined,
  DeleteOutlined,
  DesktopOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { Modal, Input, Select } from 'antd';
import { api } from '../../api/client.js';
import { EmptyState } from '../../components/common/Components.jsx';

export function BugsPage() {
  const { subjectId } = useParams();

  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedBugId, setExpandedBugId] = useState('bug-001');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Bug Form
  const [formData, setFormData] = useState({
    title: '',
    project: 'XR Sandbox',
    build: 'v1.0.0',
    device: 'Meta Quest 3',
    platform: 'Standalone Android',
    severity: 'Major',
    priority: 'P1',
    reproductionRate: '5/5 (100%)',
    preconditions: '',
    steps: '',
    expected: '',
    actual: '',
    logs: '',
    rootCause: '',
    resolution: '',
    lessonsLearned: '',
    tags: ''
  });

  const loadBugs = async () => {
    try {
      setLoading(true);
      const data = await api.getBugs(subjectId || 'xr-qa');
      setBugs(data || []);
    } catch (err) {
      console.error('Error loading bugs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBugs();
  }, [subjectId]);

  const toggleExpand = (id) => {
    setExpandedBugId(prev => prev === id ? null : id);
  };

  const handleCreateBug = async () => {
    if (!formData.title.trim() || !formData.actual.trim()) return;

    try {
      const stepsArray = formData.steps
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      await api.createBug({
        subjectId: subjectId || 'xr-qa',
        ...formData,
        steps: stepsArray,
        tags: tagsArray
      });

      setIsModalOpen(false);
      setFormData({
        title: '',
        project: 'XR Sandbox',
        build: 'v1.0.0',
        device: 'Meta Quest 3',
        platform: 'Standalone Android',
        severity: 'Major',
        priority: 'P1',
        reproductionRate: '5/5 (100%)',
        preconditions: '',
        steps: '',
        expected: '',
        actual: '',
        logs: '',
        rootCause: '',
        resolution: '',
        lessonsLearned: '',
        tags: ''
      });
      loadBugs();
    } catch (err) {
      console.error('Error creating bug:', err);
    }
  };

  const handleDeleteBug = async (id) => {
    try {
      await api.deleteBug(id);
      loadBugs();
    } catch (err) {
      console.error('Error deleting bug:', err);
    }
  };

  const filteredBugs = bugs.filter(b => {
    const matchesSeverity = severityFilter === 'all' || b.severity === severityFilter;
    const matchesSearch =
      !searchFilter ||
      b.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.project.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.device.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.rootCause?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.tags?.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()));

    return matchesSeverity && matchesSearch;
  });

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>CRITICAL</span>;
      case 'Major':
        return <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>MAJOR</span>;
      default:
        return <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>MODERATE</span>;
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <BugOutlined style={{ color: '#ef4444' }} />
            <span>XR QA Defect & Bug Journal</span>
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
            Real-world spatial defects, physics glitches, and stereo visual bugs analyzed with root causes and lessons learned.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: '#2563eb',
            border: 'none',
            borderRadius: 8,
            padding: '10px 18px',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <PlusOutlined />
          <span>Log Defect Case</span>
        </button>
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
        <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
          <SearchOutlined style={{ position: 'absolute', left: 12, top: 12, color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search defects by title, device, project, or root cause..."
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

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', 'Critical', 'Major', 'Moderate'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              style={{
                background: severityFilter === sev ? '#ef4444' : '#131c2e',
                border: `1px solid ${severityFilter === sev ? '#ef4444' : '#1e293b'}`,
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: severityFilter === sev ? '#ffffff' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              {sev === 'all' ? 'All Severities' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Bugs List */}
      {filteredBugs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredBugs.map(b => {
            const isExpanded = expandedBugId === b.id;
            return (
              <div
                key={b.id}
                className="dark-card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  border: isExpanded ? '1px solid #27364f' : '1px solid #1e293b'
                }}
              >
                {/* Bug Summary Row */}
                <div
                  onClick={() => toggleExpand(b.id)}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {getSeverityBadge(b.severity)}
                      <span style={{ fontSize: '0.72rem', background: '#1e293b', color: '#94a3b8', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                        {b.priority}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                        {b.title}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 3 }}>
                        {b.project} • {b.build} • {b.device} ({b.platform}) • Repro: {b.reproductionRate}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {b.date}
                    </span>
                    {isExpanded ? <DownOutlined style={{ fontSize: 13, color: '#94a3b8' }} /> : <RightOutlined style={{ fontSize: 13, color: '#94a3b8' }} />}
                  </div>
                </div>

                {/* Bug Expanded Details */}
                {isExpanded && (
                  <div style={{ padding: '24px 28px', backgroundColor: '#0d131f', borderTop: '1px solid #1e293b' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1.2fr)', gap: 24, alignItems: 'start' }}>
                      
                      {/* Left: Repro Steps & Actual vs Expected */}
                      <div>
                        {b.preconditions && (
                          <div style={{ marginBottom: 14 }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                              Preconditions:
                            </span>
                            <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: 2 }}>
                              {b.preconditions}
                            </div>
                          </div>
                        )}

                        <div style={{ marginBottom: 16 }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                            Steps to Reproduce:
                          </span>
                          <ol style={{ paddingLeft: 18, margin: '6px 0 0 0' }}>
                            {b.steps?.map((step, idx) => (
                              <li key={idx} style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: 4 }}>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                          <div style={{ padding: '12px 14px', background: '#090e18', border: '1px solid #1e293b', borderRadius: 8 }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: 4 }}>
                              Expected Result
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.45 }}>
                              {b.expected}
                            </p>
                          </div>

                          <div style={{ padding: '12px 14px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 8 }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', marginBottom: 4 }}>
                              Actual Result
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#fca5a5', margin: 0, lineHeight: 1.45 }}>
                              {b.actual}
                            </p>
                          </div>
                        </div>

                        {b.logs && (
                          <div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                              <CodeOutlined />
                              <span>ADB Logcat / Engine Callstack</span>
                            </span>
                            <pre style={{ margin: 0, maxHeight: 180 }}>
                              {b.logs}
                            </pre>
                          </div>
                        )}
                      </div>

                      {/* Right: Root Cause, Resolution & Lessons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ padding: '14px 18px', background: '#131c2e', borderLeft: '3px solid #f59e0b', borderRadius: '0 8px 8px 0' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' }}>
                            🔍 Root Cause Analysis:
                          </span>
                          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                            {b.rootCause || 'Root cause under investigation.'}
                          </p>
                        </div>

                        <div style={{ padding: '14px 18px', background: '#131c2e', borderLeft: '3px solid #10b981', borderRadius: '0 8px 8px 0' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                            🛠️ Technical Resolution:
                          </span>
                          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                            {b.resolution || 'Pending engineering fix verification.'}
                          </p>
                        </div>

                        <div style={{ padding: '14px 18px', background: 'rgba(59, 130, 246, 0.08)', borderLeft: '3px solid #3b82f6', borderRadius: '0 8px 8px 0' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase' }}>
                            💡 QA Lesson Learned:
                          </span>
                          <p style={{ fontSize: '0.88rem', color: '#e2e8f0', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                            {b.lessonsLearned}
                          </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #1e293b' }}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {b.tags?.map(t => (
                              <span key={t} style={{ background: '#0a0f18', border: '1px solid #1e293b', borderRadius: 4, padding: '1px 6px', fontSize: '0.7rem', color: '#94a3b8' }}>
                                #{t}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => handleDeleteBug(b.id)}
                            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
                            title="Delete Defect"
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BugOutlined}
          title="No defects found"
          description="Log a real defect case encountered during testing to transform it into learning material!"
          action={
            <button
              onClick={() => setIsModalOpen(true)}
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
              Log Defect
            </button>
          }
        />
      )}

      {/* Log Bug Modal */}
      <Modal
        title="Log Real-World QA Defect"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleCreateBug}
        okText="Log Defect"
        cancelText="Cancel"
        width={720}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '10px 0' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Defect Title *</label>
            <Input
              placeholder="e.g. XR Origin tracking offset drops to floor when boundary is disabled"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 2 }}>Severity</label>
              <Select
                style={{ width: '100%' }}
                value={formData.severity}
                onChange={(val) => setFormData(prev => ({ ...prev, severity: val }))}
                options={[
                  { value: 'Critical', label: 'Critical' },
                  { value: 'Major', label: 'Major' },
                  { value: 'Moderate', label: 'Moderate' }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 2 }}>Priority</label>
              <Select
                style={{ width: '100%' }}
                value={formData.priority}
                onChange={(val) => setFormData(prev => ({ ...prev, priority: val }))}
                options={[
                  { value: 'P0', label: 'P0' },
                  { value: 'P1', label: 'P1' },
                  { value: 'P2', label: 'P2' }
                ]}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 2 }}>Device</label>
              <Input
                value={formData.device}
                onChange={(e) => setFormData(prev => ({ ...prev, device: e.target.value }))}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 2 }}>Repro Rate</label>
              <Input
                value={formData.reproductionRate}
                onChange={(e) => setFormData(prev => ({ ...prev, reproductionRate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Steps to Reproduce (one per line) *</label>
            <Input.TextArea
              rows={3}
              placeholder="1. Launch build&#10;2. Pick up scalpel&#10;3. Flick controller"
              value={formData.steps}
              onChange={(e) => setFormData(prev => ({ ...prev, steps: e.target.value }))}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Expected Result</label>
              <Input.TextArea
                rows={2}
                value={formData.expected}
                onChange={(e) => setFormData(prev => ({ ...prev, expected: e.target.value }))}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Actual Result *</label>
              <Input.TextArea
                rows={2}
                value={formData.actual}
                onChange={(e) => setFormData(prev => ({ ...prev, actual: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Root Cause & Lessons Learned</label>
            <Input.TextArea
              rows={2}
              placeholder="What caused it and what should QA verify next time?"
              value={formData.lessonsLearned}
              onChange={(e) => setFormData(prev => ({ ...prev, lessonsLearned: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
