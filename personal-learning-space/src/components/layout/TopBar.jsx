import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
  CompassOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useSubject } from '../../context/SubjectContext.jsx';
import { useLearning } from '../../context/LearningContext.jsx';

export function TopBar() {
  const { currentSubject } = useSubject();
  const { setIsSearchOpen } = useLearning();
  const navigate = useNavigate();

  return (
    <header
      style={{
        height: 64,
        backgroundColor: '#0f1623',
        borderBottom: '1px solid #1e293b',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      {/* Breadcrumb / Subject Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate('/subjects')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.85rem',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <span>MY LEARNING SPACE</span>
          <RightOutlined style={{ fontSize: 10, color: '#64748b' }} />
        </button>
        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.02em' }}>
          {currentSubject ? `${currentSubject.title} LEARNING SPACE` : 'XR QA LEARNING SPACE'}
        </span>
      </div>

      {/* Actions: Search, Settings, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Search Trigger Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: '#0a0f18',
            border: '1px solid #1e293b',
            borderRadius: 8,
            padding: '6px 14px',
            color: '#94a3b8',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'border-color 150ms ease'
          }}
        >
          <SearchOutlined style={{ fontSize: 14 }} />
          <span style={{ display: 'inline-block' }}>Search concepts, notes...</span>
          <kbd
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 4,
              padding: '1px 6px',
              fontSize: '0.7rem',
              color: '#cbd5e1',
              fontFamily: 'monospace'
            }}
          >
            Ctrl K
          </kbd>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => navigate('/subjects')}
          title="Subjects & Workspace Settings"
          style={{
            background: 'transparent',
            border: '1px solid #1e293b',
            borderRadius: 8,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <SettingOutlined style={{ fontSize: 16 }} />
        </button>

        {/* User Profile Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '4px 10px',
            background: '#0a0f18',
            border: '1px solid #1e293b',
            borderRadius: 20
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            V
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
            Vishal
          </span>
        </div>
      </div>
    </header>
  );
}
