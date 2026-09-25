import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  RetweetOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  BookOutlined,
  SmileOutlined,
  FrownOutlined,
  MehOutlined
} from '@ant-design/icons';
import { api } from '../../api/client.js';
import { useLearning } from '../../context/LearningContext.jsx';
import { DifficultyTag, ProgressBar, EmptyState } from '../../components/common/Components.jsx';

export function RecallPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { refreshData } = useLearning();

  const [recallItems, setRecallItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  useEffect(() => {
    async function loadRecall() {
      try {
        setLoading(true);
        const data = await api.getRecallItems(subjectId || 'xr-qa');
        setRecallItems(data || []);
      } catch (err) {
        console.error('Error loading recall items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRecall();
  }, [subjectId]);

  const currentItem = recallItems[currentIndex];

  const handleRating = async (rating) => {
    if (!currentItem) return;
    try {
      await api.reviewRecallItem(subjectId || 'xr-qa', currentItem.conceptId, rating);
      refreshData();

      if (currentIndex + 1 < recallItems.length) {
        setCurrentIndex(prev => prev + 1);
        setIsRevealed(false);
      } else {
        setSessionCompleted(true);
      }
    } catch (err) {
      console.error('Error submitting recall rating:', err);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ padding: '60px 24px', textAlign: 'center', color: '#94a3b8' }}>
        Calculating active memory retention and spaced intervals...
      </div>
    );
  }

  if (sessionCompleted || recallItems.length === 0) {
    return (
      <div className="page-container" style={{ maxWidth: 760 }}>
        <div className="dark-card" style={{ padding: '48px 36px', textAlign: 'center' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            margin: '0 auto 20px auto'
          }}>
            <CheckCircleOutlined />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
            Today's Revision Complete! 🎉
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', maxWidth: 480, margin: '0 auto 28px auto' }}>
            You reviewed all concepts scheduled for spaced repetition today. Spaced intervals have been updated based on your recall ratings.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
            <button
              onClick={() => navigate(`/subjects/${subjectId}/weak-areas`)}
              style={{
                background: '#131c2e',
                border: '1px solid #1e293b',
                color: '#f8fafc',
                padding: '10px 20px',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Check Weak Areas
            </button>

            <button
              onClick={() => navigate(`/subjects/${subjectId}`)}
              style={{
                background: '#2563eb',
                border: 'none',
                color: '#ffffff',
                padding: '10px 22px',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / recallItems.length) * 100);

  return (
    <div className="page-container" style={{ maxWidth: 840 }}>
      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#f59e0b', textTransform: 'uppercase', fontWeight: 700 }}>
            Card {currentIndex + 1} of {recallItems.length} Due for Revision
          </span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '2px 0 0 0', color: '#f8fafc' }}>
            {currentItem.title}
          </h2>
        </div>
        <DifficultyTag level={currentItem.difficulty} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <ProgressBar value={progressPercent} variant="warning" height={6} />
      </div>

      {/* Active Recall Card */}
      <div
        className="dark-card"
        style={{
          padding: '32px 36px',
          background: 'linear-gradient(180deg, #131c2e 0%, #0f1623 100%)',
          border: '1px solid #27364f',
          minHeight: 320,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginBottom: 20
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {currentItem.moduleTitle}
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: currentItem.recallStrength < 50 ? '#ef4444' : '#f59e0b',
              background: currentItem.recallStrength < 50 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              padding: '2px 8px',
              borderRadius: 6
            }}>
              {currentItem.recallStrength}% retention
            </span>
          </div>

          {/* Active Recall Challenge Prompt */}
          <div style={{ margin: '16px 0 24px 0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 6 }}>
              🧠 Recall Challenge:
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.5, margin: 0 }}>
              {currentItem.promptQuestion}
            </p>
          </div>

          {/* Revealed Answer Content */}
          {isRevealed && (
            <div style={{
              padding: '20px',
              background: '#090e18',
              border: '1px solid #1e293b',
              borderRadius: 8,
              marginTop: 16
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', marginBottom: 6, textTransform: 'uppercase' }}>
                Key Technical Answer & Core Principles:
              </div>
              <p style={{ fontSize: '0.94rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: 14 }}>
                {currentItem.summary}
              </p>

              {currentItem.keyTakeaways?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {currentItem.keyTakeaways.map((k, idx) => (
                    <div key={idx} style={{ fontSize: '0.86rem', color: '#94a3b8' }}>
                      • {k}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: Reveal or Rate */}
        <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid #1e293b' }}>
          {!isRevealed ? (
            <button
              onClick={() => setIsRevealed(true)}
              style={{
                width: '100%',
                background: '#2563eb',
                border: 'none',
                color: '#ffffff',
                padding: '12px 0',
                borderRadius: 8,
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <EyeOutlined />
              <span>Reveal Answer</span>
            </button>
          ) : (
            <div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center', marginBottom: 12, fontWeight: 600 }}>
                Rate your recall quality to calculate the next repetition interval:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <button
                  onClick={() => handleRating('again')}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '10px 8px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  <div>Forgot (Again)</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Repeat Today</div>
                </button>

                <button
                  onClick={() => handleRating('hard')}
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#fbbf24',
                    padding: '10px 8px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  <div>Hard</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Review in 1-2d</div>
                </button>

                <button
                  onClick={() => handleRating('good')}
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#60a5fa',
                    padding: '10px 8px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  <div>Good</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Review in 4-5d</div>
                </button>

                <button
                  onClick={() => handleRating('easy')}
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    padding: '10px 8px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  <div>Easy</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Review in 8-10d</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
