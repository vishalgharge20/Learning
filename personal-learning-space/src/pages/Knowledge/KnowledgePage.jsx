import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  BookOutlined,
  PlusOutlined,
  SearchOutlined,
  TagOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { Modal, Input, Select } from 'antd';
import { api } from '../../api/client.js';
import { EmptyState } from '../../components/common/Components.jsx';

export function KnowledgePage() {
  const { subjectId } = useParams();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'qa_tip',
    tags: ''
  });

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await api.getNotes(subjectId || 'xr-qa');
      setNotes(data || []);
    } catch (err) {
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [subjectId]);

  const handleCreateNote = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      await api.createNote({
        subjectId: subjectId || 'xr-qa',
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: tagsArray
      });

      setIsModalOpen(false);
      setFormData({ title: '', content: '', category: 'qa_tip', tags: '' });
      loadNotes();
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await api.deleteNote(id);
      loadNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = notes.filter(n => {
    const matchesCategory = activeCategory === 'all' || n.category === activeCategory;
    const matchesSearch =
      !searchFilter ||
      n.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      n.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
      n.tags?.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-container" style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOutlined style={{ color: '#10b981' }} />
            <span>Knowledge Base & Technical Notes</span>
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
            Personal observations, ADB cheat sheets, profiler diagnostic checklists, and verified QA engineering tips.
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
          <span>New Technical Note</span>
        </button>
      </div>

      {/* Filter and Category Bar */}
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
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
          <SearchOutlined style={{ position: 'absolute', left: 12, top: 12, color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search notes, ADB commands, profiler metrics, tags..."
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

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Notes' },
            { id: 'cheat_sheet', label: 'Cheat Sheets' },
            { id: 'qa_tip', label: 'QA Tips' },
            { id: 'snippet', label: 'Code Snippets' },
            { id: 'observation', label: 'Observations' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: activeCategory === cat.id ? '#10b981' : '#131c2e',
                border: `1px solid ${activeCategory === cat.id ? '#10b981' : '#1e293b'}`,
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: activeCategory === cat.id ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
          {filteredNotes.map(n => (
            <div
              key={n.id}
              className="dark-card"
              style={{
                padding: '22px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span
                    style={{
                      background: n.category === 'cheat_sheet' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: n.category === 'cheat_sheet' ? '#60a5fa' : '#34d399',
                      border: `1px solid ${n.category === 'cheat_sheet' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      textTransform: 'uppercase'
                    }}
                  >
                    {n.category.replace('_', ' ')}
                  </span>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => handleCopy(n.id, n.content)}
                      title="Copy content"
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
                    >
                      {copiedId === n.id ? <CheckOutlined style={{ color: '#10b981' }} /> : <CopyOutlined />}
                    </button>
                    <button
                      onClick={() => handleDeleteNote(n.id)}
                      title="Delete note"
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12, color: '#f8fafc', lineHeight: 1.35 }}>
                  {n.title}
                </h3>

                <pre style={{
                  maxHeight: 280,
                  overflowY: 'auto',
                  margin: '0 0 16px 0',
                  fontSize: '0.82rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap'
                }}>
                  {n.content}
                </pre>
              </div>

              {/* Tags and Updated date */}
              <div style={{ paddingTop: 12, borderTop: '1px solid #1a2234', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {n.tags?.map(t => (
                    <span
                      key={t}
                      style={{
                        background: '#0a0f18',
                        border: '1px solid #1e293b',
                        borderRadius: 4,
                        padding: '1px 6px',
                        fontSize: '0.7rem',
                        color: '#94a3b8'
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {new Date(n.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOutlined}
          title="No notes found"
          description="Create your first technical reference note or cheat sheet!"
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
              Add Note
            </button>
          }
        />
      )}

      {/* Create Note Modal */}
      <Modal
        title="Add Technical Reference Note"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleCreateNote}
        okText="Save Note"
        cancelText="Cancel"
        width={620}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '10px 0' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Note Title *</label>
            <Input
              placeholder="e.g. Profiler Timeline: Main Thread spikes vs Render Thread stalls"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Category</label>
            <Select
              style={{ width: '100%' }}
              value={formData.category}
              onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
              options={[
                { value: 'qa_tip', label: 'QA Tip' },
                { value: 'cheat_sheet', label: 'Cheat Sheet' },
                { value: 'snippet', label: 'Code Snippet' },
                { value: 'observation', label: 'Observation' }
              ]}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Tags (comma-separated)</label>
            <Input
              placeholder="e.g. ADB, Quest3, Profiling, GPU"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Content / Markdown *</label>
            <Input.TextArea
              rows={8}
              placeholder="Enter technical explanation, commands, code, or observations..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
