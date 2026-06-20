import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import './AppLayout.css';

/**
 * AppLayout — Shell layout for authenticated pages.
 * Renders the fixed Sidebar on the left and the routed page content (Outlet) on the right.
 */
const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-layout__main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
export { AppLayout };
