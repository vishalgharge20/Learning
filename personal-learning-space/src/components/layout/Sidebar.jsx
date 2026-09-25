import React, { useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  ReadOutlined,
  RetweetOutlined,
  ExperimentOutlined,
  AimOutlined,
  BugOutlined,
  LineChartOutlined,
  BookOutlined,
  ThunderboltOutlined,
  RobotOutlined,
  LeftOutlined,
  RightOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useSubject } from '../../context/SubjectContext.jsx';
import { useLearning } from '../../context/LearningContext.jsx';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { currentSubjectId, currentSubject } = useSubject();
  const { recallItems, weakAreas } = useLearning();
  const navigate = useNavigate();

  const baseRoute = `/subjects/${currentSubjectId || 'xr-qa'}`;

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: DashboardOutlined, path: baseRoute, exact: true },
    { key: 'learn', label: 'Learn', icon: ReadOutlined, path: `${baseRoute}/learn` },
    { 
      key: 'recall', 
      label: 'Recall', 
      icon: RetweetOutlined, 
      path: `${baseRoute}/recall`,
      badge: recallItems.length > 0 ? recallItems.length : null,
      badgeColor: '#f59e0b'
    },
    { key: 'practice', label: 'Practice', icon: ExperimentOutlined, path: `${baseRoute}/practice` },
    { key: 'quiz', label: 'Quiz', icon: AimOutlined, path: `${baseRoute}/quiz` },
    { key: 'bugs', label: 'Bugs', icon: BugOutlined, path: `${baseRoute}/bugs` },
    { key: 'progress', label: 'Progress', icon: LineChartOutlined, path: `${baseRoute}/progress` },
    { key: 'knowledge', label: 'Knowledge', icon: BookOutlined, path: `${baseRoute}/knowledge` },
    { 
      key: 'weak-areas', 
      label: 'Weak Areas', 
      icon: ThunderboltOutlined, 
      path: `${baseRoute}/weak-areas`,
      badge: weakAreas.reduce((acc, g) => acc + g.items.length, 0) || null,
      badgeColor: '#ef4444'
    },
    { key: 'ai-teacher', label: 'AI Teacher', icon: RobotOutlined, path: `${baseRoute}/ai-teacher` }
  ];

  return (
    <aside
      style={{
        width: collapsed ? 72 : 240,
        backgroundColor: '#0b111c',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 200ms ease',
        zIndex: 50,
        flexShrink: 0
      }}
    >
      {/* Brand & Subject Switcher Header */}
      <div
        style={{
          height: 64,
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 16px' : '0 20px',
          gap: 12,
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}
      >
        <button
          onClick={() => navigate('/subjects')}
          title="All Subjects"
          style={{
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            width: 34,
            height: 34,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3b82f6',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <AppstoreOutlined style={{ fontSize: 16 }} />
        </button>

        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap' }}>
              {currentSubject?.title || 'XR QA'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap' }}>
              Learning Space
            </div>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.exact}
                title={collapsed ? item.label : undefined}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed ? '10px 0' : '9px 12px',
                  borderRadius: 8,
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  position: 'relative',
                  transition: 'all 150ms ease'
                })}
              >
                <Icon style={{ fontSize: 17, flexShrink: 0 }} />
                {!collapsed && (
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span
                    style={{
                      background: `${item.badgeColor}22`,
                      color: item.badgeColor,
                      border: `1px solid ${item.badgeColor}44`,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 10
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Collapse Toggle Footer */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'space-between',
          alignItems: 'center'
        }}
      >
        {!collapsed && (
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Personal Space v1.0
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </button>
      </div>
    </aside>
  );
}
