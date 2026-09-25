import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  SearchOutlined,
  ReadOutlined,
  BookOutlined,
  BugOutlined,
  AppstoreOutlined,
  RightOutlined
} from '@ant-design/icons';
import { api } from '../../api/client.js';
import { useLearning } from '../../context/LearningContext.jsx';

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useLearning();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await api.search(query.trim());
        setResults(data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url) => {
    setIsSearchOpen(false);
    navigate(url);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'concept': return <ReadOutlined style={{ color: '#3b82f6' }} />;
      case 'module': return <AppstoreOutlined style={{ color: '#8b5cf6' }} />;
      case 'note': return <BookOutlined style={{ color: '#10b981' }} />;
      case 'bug': return <BugOutlined style={{ color: '#ef4444' }} />;
      default: return <SearchOutlined style={{ color: '#94a3b8' }} />;
    }
  };

  return (
    <Modal
      open={isSearchOpen}
      onCancel={() => setIsSearchOpen(false)}
      footer={null}
      closable={false}
      width={600}
      centered
      bodyStyle={{ padding: 0 }}
      style={{ top: 80 }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b' }}>
        <Input
          ref={inputRef}
          prefix={<SearchOutlined style={{ color: '#64748b', fontSize: 18, marginRight: 8 }} />}
          placeholder="Search curriculum, concepts, notes, bugs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="borderless"
          style={{ fontSize: '1rem', color: '#f8fafc' }}
        />
      </div>

      <div style={{ maxHeight: 380, overflowY: 'auto', padding: '12px 10px' }}>
        {loading && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
            Searching workspace...
          </div>
        )}

        {!loading && query.trim() && results.length === 0 && (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: '#64748b' }}>
            No results found for "{query}"
          </div>
        )}

        {!loading && !query.trim() && (
          <div style={{ padding: '20px', color: '#64748b', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Quick searches:</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Unity Profiler', 'ADB Logcat', 'XR Grab Interactable', '6DoF Tracking', 'Frame Time'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  style={{
                    background: '#131c2e',
                    border: '1px solid #1e293b',
                    borderRadius: 6,
                    padding: '4px 10px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {results.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            onClick={() => handleSelect(item.url)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background-color 150ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#17233a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: '#0a0f18',
                border: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14
              }}>
                {getIcon(item.type)}
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {item.subtitle}
                </div>
              </div>
            </div>
            <RightOutlined style={{ fontSize: 11, color: '#64748b' }} />
          </div>
        ))}
      </div>

      <div style={{
        padding: '10px 18px',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#64748b'
      }}>
        <span>Navigate with clicks or arrow keys</span>
        <span>ESC to close</span>
      </div>
    </Modal>
  );
}
