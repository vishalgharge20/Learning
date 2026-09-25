import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { TopBar } from './TopBar.jsx';
import { SearchModal } from './SearchModal.jsx';

export function AppLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content-wrapper">
        <TopBar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
      <SearchModal />
    </div>
  );
}
