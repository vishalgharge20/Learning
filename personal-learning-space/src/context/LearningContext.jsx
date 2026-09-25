import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client.js';
import { useSubject } from './SubjectContext.jsx';

const LearningContext = createContext(null);

export function LearningProvider({ children }) {
  const { currentSubjectId } = useSubject();
  const [stats, setStats] = useState(null);
  const [weakAreas, setWeakAreas] = useState([]);
  const [recallItems, setRecallItems] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLearningData = async () => {
    if (!currentSubjectId) return;
    try {
      setLoading(true);
      const [progressData, weakData, recallData] = await Promise.all([
        api.getProgress(currentSubjectId).catch(() => null),
        api.getWeakAreas(currentSubjectId).catch(() => []),
        api.getRecallItems(currentSubjectId).catch(() => [])
      ]);
      setStats(progressData);
      setWeakAreas(weakData || []);
      setRecallItems(recallData || []);
    } catch (err) {
      console.error('Error fetching learning state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningData();
  }, [currentSubjectId]);

  // Global keyboard shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateProgress = async (conceptId, progressData) => {
    try {
      await api.updateConceptProgress(currentSubjectId, conceptId, progressData);
      await fetchLearningData();
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  return (
    <LearningContext.Provider
      value={{
        stats,
        weakAreas,
        recallItems,
        isSearchOpen,
        setIsSearchOpen,
        loading,
        refreshData: fetchLearningData,
        updateProgress
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}
