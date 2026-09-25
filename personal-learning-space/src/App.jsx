import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';

import { SubjectProvider } from './context/SubjectContext.jsx';
import { LearningProvider } from './context/LearningContext.jsx';
import { AppLayout } from './components/layout/AppLayout.jsx';

import { HomePage } from './pages/Home/HomePage.jsx';
import { DashboardPage } from './pages/Dashboard/DashboardPage.jsx';
import { LearnCurriculumPage } from './pages/Learn/LearnCurriculumPage.jsx';
import { ConceptDetailPage } from './pages/Learn/ConceptDetailPage.jsx';
import { RecallPage } from './pages/Recall/RecallPage.jsx';
import { PracticePage } from './pages/Practice/PracticePage.jsx';
import { QuizPage } from './pages/Quiz/QuizPage.jsx';
import { BugsPage } from './pages/Bugs/BugsPage.jsx';
import { ProgressPage } from './pages/Progress/ProgressPage.jsx';
import { KnowledgePage } from './pages/Knowledge/KnowledgePage.jsx';
import { WeakAreasPage } from './pages/WeakAreas/WeakAreasPage.jsx';
import { AITeacherPage } from './pages/AITeacher/AITeacherPage.jsx';
import { NotFoundPage } from './pages/NotFound/NotFoundPage.jsx';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#3b82f6',
          colorBgBase: '#080c14',
          colorBgContainer: '#131c2e',
          colorBgElevated: '#1a273f',
          colorBorder: '#1e293b',
          colorText: '#f8fafc',
          colorTextSecondary: '#94a3b8',
          borderRadius: 8,
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }
      }}
    >
      <SubjectProvider>
        <LearningProvider>
          <Routes>
            {/* Global Subjects Home */}
            <Route path="/" element={<HomePage />} />
            <Route path="/subjects" element={<HomePage />} />

            {/* Subject Learning Space (Reusable Architecture for Any Subject) */}
            <Route path="/subjects/:subjectId" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="learn" element={<LearnCurriculumPage />} />
              <Route path="learn/:conceptId" element={<ConceptDetailPage />} />
              <Route path="recall" element={<RecallPage />} />
              <Route path="practice" element={<PracticePage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="bugs" element={<BugsPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="knowledge" element={<KnowledgePage />} />
              <Route path="weak-areas" element={<WeakAreasPage />} />
              <Route path="ai-teacher" element={<AITeacherPage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </LearningProvider>
      </SubjectProvider>
    </ConfigProvider>
  );
}
