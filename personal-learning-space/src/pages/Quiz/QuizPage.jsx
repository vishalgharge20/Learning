import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AimOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
  RedoOutlined,
  TrophyOutlined,
  BulbOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { api } from '../../api/client.js';
import { useLearning } from '../../context/LearningContext.jsx';
import { DifficultyTag, ProgressBar } from '../../components/common/Components.jsx';

export function QuizPage() {
  const { subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const conceptFilter = searchParams.get('conceptId');
  const navigate = useNavigate();
  const { refreshData } = useLearning();

  const [quizzes, setQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakesList, setMistakesList] = useState([]);

  useEffect(() => {
    async function loadQuizzes() {
      try {
        setLoading(true);
        const data = await api.getQuizzes(subjectId || 'xr-qa');
        let list = data || [];
        if (conceptFilter) {
          const filtered = list.filter(q => q.conceptId === conceptFilter);
          if (filtered.length > 0) list = filtered;
        }
        setQuizzes(list);
      } catch (err) {
        console.error('Error loading quizzes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuizzes();
  }, [subjectId, conceptFilter]);

  const currentQuiz = quizzes[currentIndex];

  const handleSelectOption = (idx) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(idx);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || isAnswerSubmitted || !currentQuiz) return;

    try {
      const result = await api.submitQuizAnswer(subjectId || 'xr-qa', currentQuiz.id, selectedOption);
      setEvaluationResult(result);
      setIsAnswerSubmitted(true);

      if (result.isCorrect) {
        setScore(prev => prev + 1);
      } else {
        setMistakesList(prev => [...prev, currentQuiz]);
      }

      refreshData();
    } catch (err) {
      console.error('Error submitting quiz answer:', err);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizzes.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setEvaluationResult(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setEvaluationResult(null);
    setScore(0);
    setIsFinished(false);
    setMistakesList([]);
  };

  if (loading) {
    return (
      <div className="page-container" style={{ padding: '60px 24px', textAlign: 'center', color: '#94a3b8' }}>
        Loading QA knowledge assessment...
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="page-container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2>No quizzes available for this filter</h2>
        <button
          onClick={() => navigate(`/subjects/${subjectId}/quiz`)}
          style={{ marginTop: 16, background: '#2563eb', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer' }}
        >
          View All Quizzes
        </button>
      </div>
    );
  }

  // Quiz Finished Summary View
  if (isFinished) {
    const accuracy = Math.round((score / quizzes.length) * 100);
    return (
      <div className="page-container" style={{ maxWidth: 760 }}>
        <div className="dark-card" style={{ padding: '40px 36px', textAlign: 'center' }}>
          <div style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: accuracy >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: accuracy >= 70 ? '#10b981' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 20px auto'
          }}>
            <TrophyOutlined />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8, color: '#f8fafc' }}>
            Assessment Complete!
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: 24 }}>
            You scored {score} out of {quizzes.length} questions correctly ({accuracy}%).
          </p>

          <div style={{ maxWidth: 320, margin: '0 auto 32px auto' }}>
            <ProgressBar value={accuracy} variant="auto" height={10} showLabel={false} />
          </div>

          {/* Identified Weak Areas */}
          {mistakesList.length > 0 && (
            <div style={{
              textAlign: 'left',
              background: '#0a0f18',
              border: '1px solid #1e293b',
              borderRadius: 8,
              padding: '18px 20px',
              marginBottom: 28
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <ThunderboltOutlined style={{ color: '#ef4444' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  Identified Weak Concepts to Review ({mistakesList.length})
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mistakesList.map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/subjects/${subjectId}/learn/${m.conceptId}`)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: '#131c2e',
                      borderRadius: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 500 }}>
                      • {m.title}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#3b82f6', fontWeight: 600 }}>
                      Review Concept →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
            <button
              onClick={handleRestart}
              style={{
                background: '#131c2e',
                border: '1px solid #1e293b',
                color: '#f8fafc',
                padding: '10px 20px',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <RedoOutlined />
              <span>Retry Quiz</span>
            </button>

            <button
              onClick={() => navigate(`/subjects/${subjectId}/weak-areas`)}
              style={{
                background: '#2563eb',
                border: 'none',
                color: '#ffffff',
                padding: '10px 24px',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Go to Weak Areas
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / quizzes.length) * 100);

  return (
    <div className="page-container" style={{ maxWidth: 840 }}>
      {/* Quiz Progress Header */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
            Question {currentIndex + 1} of {quizzes.length}
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0', color: '#f8fafc' }}>
            {currentQuiz.title}
          </h2>
        </div>
        <DifficultyTag level={currentQuiz.difficulty} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <ProgressBar value={progressPercent} variant="primary" height={6} />
      </div>

      {/* Main Question Card */}
      <div className="dark-card" style={{ padding: '28px 32px', marginBottom: 20 }}>
        <p style={{ fontSize: '1.08rem', color: '#f8fafc', fontWeight: 600, lineHeight: 1.6, marginBottom: 24 }}>
          {currentQuiz.question}
        </p>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {currentQuiz.options?.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let optionBg = '#0a0f18';
            let optionBorder = '#1e293b';
            let optionColor = '#cbd5e1';

            if (isAnswerSubmitted) {
              if (idx === evaluationResult?.correctAnswer) {
                optionBg = 'rgba(16, 185, 129, 0.15)';
                optionBorder = '#10b981';
                optionColor = '#6ee7b7';
              } else if (isSelected && !evaluationResult?.isCorrect) {
                optionBg = 'rgba(239, 68, 68, 0.15)';
                optionBorder = '#ef4444';
                optionColor = '#fca5a5';
              }
            } else if (isSelected) {
              optionBg = 'rgba(59, 130, 246, 0.15)';
              optionBorder = '#3b82f6';
              optionColor = '#93c5fd';
            }

            return (
              <div
                key={idx}
                onClick={() => handleSelectOption(idx)}
                style={{
                  padding: '14px 18px',
                  borderRadius: 8,
                  background: optionBg,
                  border: `1px solid ${optionBorder}`,
                  color: optionColor,
                  fontSize: '0.94rem',
                  fontWeight: 500,
                  cursor: isAnswerSubmitted ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'all 150ms ease'
                }}
              >
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: `1px solid ${optionBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span style={{ flex: 1, lineHeight: 1.4 }}>{opt}</span>
                {isAnswerSubmitted && idx === evaluationResult?.correctAnswer && (
                  <CheckCircleOutlined style={{ color: '#10b981', fontSize: 18 }} />
                )}
                {isAnswerSubmitted && isSelected && !evaluationResult?.isCorrect && (
                  <CloseCircleOutlined style={{ color: '#ef4444', fontSize: 18 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Submit or Next Controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              style={{
                background: selectedOption !== null ? '#2563eb' : '#1e293b',
                border: 'none',
                color: selectedOption !== null ? '#ffffff' : '#64748b',
                padding: '10px 24px',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: selectedOption !== null ? 'pointer' : 'not-allowed'
              }}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                background: '#2563eb',
                border: 'none',
                color: '#ffffff',
                padding: '10px 24px',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <span>{currentIndex + 1 < quizzes.length ? 'Next Question' : 'View Results'}</span>
              <ArrowRightOutlined />
            </button>
          )}
        </div>
      </div>

      {/* Answer Explanation Card (Revealed after submission) */}
      {isAnswerSubmitted && evaluationResult && (
        <div
          className="dark-card"
          style={{
            padding: '22px 26px',
            borderLeft: `4px solid ${evaluationResult.isCorrect ? '#10b981' : '#ef4444'}`,
            background: '#0d1525'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            {evaluationResult.isCorrect ? (
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1rem' }}>✓ Correct! Well analyzed.</span>
            ) : (
              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '1rem' }}>✗ Incorrect Answer</span>
            )}
          </div>

          <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 14px 0' }}>
            {evaluationResult.explanation}
          </p>

          <div style={{
            padding: '10px 14px',
            background: '#090e18',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10
          }}>
            <BulbOutlined style={{ color: '#f59e0b', marginTop: 2 }} />
            <div style={{ fontSize: '0.85rem', color: '#fbbf24' }}>
              <strong>QA Takeaway:</strong> {evaluationResult.qaTakeaway}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
