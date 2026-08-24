import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { RightSidebar } from '../RightSidebar';
import { MobileHeader } from '../MobileHeader';
import './AppLayout.css';

/**
 * AppLayout — Layout avec Sidebar gauche fixe et ensemble (Outlet + RightSidebar) centré.
 */
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isLessonView = location.pathname.startsWith('/lesson/');

  return (
    <div className="app-layout">
      {/* En-tête mobile fixe en haut */}
      {!isLessonView && <MobileHeader />}

      {/* Sidebar gauche fixe (Desktop) - Masquée en mode lecture de leçon */}
      {!isLessonView && <Sidebar />}

      {/* Zone globale centrée - Pleine largeur en mode leçon */}
      <div
        className="app-layout__wrapper"
        style={isLessonView ? { marginLeft: 0, width: '100%' } : undefined}
      >
        {/* Conteneur duo (Outlet + RightSidebar) collé & centré */}
        <div className="app-layout__container" style={isLessonView ? { maxWidth: '960px', margin: '0 auto' } : undefined}>
          <main className="app-layout__main">
            <Outlet />
          </main>
          {!isLessonView && <RightSidebar />}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
export { AppLayout };
