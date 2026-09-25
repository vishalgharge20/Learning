import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CompassOutlined } from '@ant-design/icons';
import { EmptyState } from '../../components/common/Components.jsx';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ padding: '80px 24px' }}>
      <EmptyState
        icon={CompassOutlined}
        title="404 - Page Not Found"
        description="The learning space location you requested does not exist or has been moved."
        action={
          <button
            onClick={() => navigate('/subjects')}
            style={{
              background: '#2563eb',
              border: 'none',
              color: '#ffffff',
              padding: '8px 20px',
              borderRadius: 8,
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Return to Learning Space
          </button>
        }
      />
    </div>
  );
}
