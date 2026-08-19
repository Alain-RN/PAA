import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { RightSidebar } from '../RightSidebar';
import { MobileHeader } from '../MobileHeader';
import './AppLayout.css';

/**
 * AppLayout — Layout avec Sidebar gauche fixe et ensemble (Outlet + RightSidebar) centré.
 */
const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      {/* En-tête mobile fixe en haut */}
      <MobileHeader />

      {/* Sidebar gauche fixe (Desktop) / Bottom bar (Mobile) */}
      <Sidebar />

      {/* Zone globale centrée */}
      <div className="app-layout__wrapper">
        {/* Conteneur duo (Outlet + RightSidebar) collé & centré */}
        <div className="app-layout__container">
          <main className="app-layout__main">
            <Outlet />
          </main>
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
export { AppLayout };
