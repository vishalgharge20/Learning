import React from 'react';

export function ProgressBar({ value = 0, variant = 'primary', showLabel = false, height = 8 }) {
  const clamped = Math.min(100, Math.max(0, value));

  let colorClass = variant;
  if (variant === 'auto') {
    if (clamped >= 80) colorClass = 'success';
    else if (clamped >= 50) colorClass = 'primary';
    else if (clamped >= 25) colorClass = 'warning';
    else colorClass = 'danger';
  }

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.8rem', color: '#94a3b8' }}>
          <span>Progress</span>
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>{clamped}%</span>
        </div>
      )}
      <div className="custom-progress-bar" style={{ height }}>
        <div
          className={`progress-fill ${colorClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function StatusBadge({ status = 'not_started' }) {
  const config = {
    not_started: { label: 'Not Started', className: 'status-not_started' },
    learning: { label: 'Learning', className: 'status-learning' },
    practicing: { label: 'Practicing', className: 'status-practicing' },
    learned: { label: 'Learned', className: 'status-learned' },
    needs_review: { label: 'Needs Review', className: 'status-needs_review' }
  };

  const item = config[status] || config.not_started;

  return (
    <span className={`badge-status ${item.className}`}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: 'currentColor'
      }} />
      {item.label}
    </span>
  );
}

export function DifficultyTag({ level = 'beginner' }) {
  const map = {
    beginner: { label: 'Beginner', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
    intermediate: { label: 'Intermediate', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
    advanced: { label: 'Advanced', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' }
  };

  const current = map[level?.toLowerCase()] || map.beginner;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: '0.72rem',
      fontWeight: 600,
      color: current.color,
      background: current.bg,
      border: `1px solid ${current.color}33`,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }}>
      {current.label}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{
      padding: '48px 24px',
      textAlign: 'center',
      background: 'rgba(19, 28, 46, 0.5)',
      border: '1px dashed #27364f',
      borderRadius: 12,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {Icon && <Icon style={{ fontSize: 36, color: '#64748b', marginBottom: 16 }} />}
      <h3 style={{ fontSize: '1.1rem', marginBottom: 6, color: '#f8fafc' }}>{title}</h3>
      {description && <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: 420, marginBottom: action ? 20 : 0 }}>{description}</p>}
      {action}
    </div>
  );
}

export function MetricCard({ title, value, subtitle, icon: Icon, color = '#3b82f6', onClick }) {
  return (
    <div
      className={`dark-card ${onClick ? 'clickable-card' : ''}`}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>{title}</span>
        {Icon && (
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: `${color}18`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16
          }}>
            <Icon />
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.1, marginBottom: 4 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
