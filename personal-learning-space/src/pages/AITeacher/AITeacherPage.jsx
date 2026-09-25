import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  RobotOutlined,
  SendOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  UserOutlined,
  CompassOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { api } from '../../api/client.js';
import { useSubject } from '../../context/SubjectContext.jsx';
import { useLearning } from '../../context/LearningContext.jsx';

export function AITeacherPage() {
  const { subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');
  const conceptParam = searchParams.get('conceptId');

  const { currentSubject } = useSubject();
  const { stats, weakAreas } = useLearning();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello Vishal! I'm your dedicated **XR QA AI Mentor**.

I have full visibility into your progress, weak areas, and active study materials for **XR QA**.

How can I help you today? You can choose a quick action below or ask me any question about Unity profiling, OpenXR, controller tracking, or test scenarios!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentConcept, setCurrentConcept] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    async function loadConceptContext() {
      if (conceptParam) {
        try {
          const data = await api.getConcept(subjectId || 'xr-qa', conceptParam);
          setCurrentConcept(data);
        } catch (err) {
          console.error(err);
        }
      }
    }
    loadConceptContext();
  }, [subjectId, conceptParam]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await api.chatAI({
        prompt: text.trim(),
        subjectId: subjectId || 'xr-qa',
        conceptId: currentConcept?.id || stats?.activeConcept?.conceptId,
        history: messages
      });

      const assistantMsg = {
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered a temporary connection issue. Please check that the server is running.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Explain this topic with an XR bug example',
    'Give me a tough practice scenario',
    'What am I forgetting?',
    'What should I learn next?',
    'Test me with a scenario question',
    'Essential ADB commands for Logcat'
  ];

  return (
    <div className="page-container" style={{ maxWidth: 1040, height: 'calc(100vh - 84px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header Context Banner */}
      <div
        className="dark-card"
        style={{
          padding: '14px 20px',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          background: 'linear-gradient(90deg, #131c2e 0%, #0f1623 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18
          }}>
            <RobotOutlined />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                AI Learning Mentor
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '1px 6px',
                borderRadius: 4,
                fontSize: '0.68rem',
                fontWeight: 700
              }}>
                CONTEXT-CONNECTED
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Subject: {currentSubject?.title || 'XR QA'} • Progress: {stats?.overallProgress || 35}% • Topic: {currentConcept?.title || stats?.activeConcept?.title || 'Unity Profiler'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', background: '#0a0f18', border: '1px solid #1e293b', padding: '4px 10px', borderRadius: 6, color: '#94a3b8' }}>
            Weak Areas: <strong style={{ color: '#ef4444' }}>{weakAreas.length}</strong>
          </span>
          <span style={{ fontSize: '0.75rem', background: '#0a0f18', border: '1px solid #1e293b', padding: '4px 10px', borderRadius: 6, color: '#94a3b8' }}>
            Retention: <strong style={{ color: '#10b981' }}>{stats?.knowledgeStrength || 85}%</strong>
          </span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div
        className="dark-card"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          marginBottom: 16
        }}
      >
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: 12,
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {!isUser && (
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  flexShrink: 0
                }}>
                  <RobotOutlined />
                </div>
              )}

              <div>
                <div style={{
                  background: isUser ? '#2563eb' : '#0a0f18',
                  border: isUser ? 'none' : '1px solid #1e293b',
                  color: isUser ? '#ffffff' : '#e2e8f0',
                  padding: '14px 18px',
                  borderRadius: 12,
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}>
                  {m.content}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: '#64748b',
                  marginTop: 4,
                  textAlign: isUser ? 'right' : 'left',
                  padding: '0 4px'
                }}>
                  {m.timestamp}
                </div>
              </div>

              {isUser && (
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#1d4ed8',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  V
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RobotOutlined />
            </div>
            <div style={{
              background: '#0a0f18',
              border: '1px solid #1e293b',
              color: '#94a3b8',
              padding: '10px 16px',
              borderRadius: 12,
              fontSize: '0.85rem'
            }}>
              Thinking and referencing your XR QA curriculum context...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, flexShrink: 0 }}>
        {quickPrompts.map(p => (
          <button
            key={p}
            onClick={() => handleSendMessage(p)}
            style={{
              background: '#131c2e',
              border: '1px solid #1e293b',
              borderRadius: 6,
              padding: '5px 12px',
              fontSize: '0.78rem',
              color: '#94a3b8',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.color = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1e293b';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            ⚡ {p}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
        style={{
          display: 'flex',
          gap: 10,
          background: '#0f1623',
          border: '1px solid #1e293b',
          borderRadius: 10,
          padding: '8px 12px',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          placeholder="Ask a question, request a scenario, or ask what you're forgetting..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#f8fafc',
            fontSize: '0.92rem',
            outline: 'none',
            padding: '6px 8px'
          }}
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || loading}
          style={{
            background: inputValue.trim() ? '#2563eb' : '#1e293b',
            border: 'none',
            color: inputValue.trim() ? '#ffffff' : '#64748b',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <span>Send</span>
          <SendOutlined />
        </button>
      </form>
    </div>
  );
}
