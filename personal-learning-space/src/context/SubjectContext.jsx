import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client.js';

const SubjectContext = createContext(null);

export function SubjectProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [currentSubjectId, setCurrentSubjectId] = useState('xr-qa');
  const [currentSubject, setCurrentSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await api.getSubjects();
      setSubjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentSubject = async (id) => {
    try {
      const data = await api.getSubject(id);
      setCurrentSubject(data);
      setCurrentSubjectId(id);
    } catch (err) {
      console.error('Error loading subject details:', err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (currentSubjectId) {
      loadCurrentSubject(currentSubjectId);
    }
  }, [currentSubjectId]);

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        currentSubjectId,
        currentSubject,
        loading,
        error,
        setCurrentSubjectId,
        refreshSubject: () => loadCurrentSubject(currentSubjectId),
        refreshAllSubjects: fetchSubjects
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
}

export function useSubject() {
  const context = useContext(SubjectContext);
  if (!context) {
    throw new Error('useSubject must be used within a SubjectProvider');
  }
  return context;
}
