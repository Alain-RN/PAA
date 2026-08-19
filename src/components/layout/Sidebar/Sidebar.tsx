import React from 'react';
import { useAppState } from '../../../hooks/useAppState';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  History,
  User as UserIcon,
  LayoutGrid,
  FileText,
  Users,
  BarChart3,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const currentRoute = location.pathname;
  const isStudent = currentUser.role === 'student';

  const navItems = isStudent
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'catalog', label: 'Cours', icon: BookOpen, path: '/catalog' },
        { id: 'leaderboard', label: 'Classement', icon: Trophy, path: '/leaderboard' },
        { id: 'history', label: 'Historique', icon: History, path: '/history' },
        { id: 'profile', label: 'Profil', icon: UserIcon, path: '/profile' },
      ]
    : [
        { id: 'admin-dashboard', label: 'Console Admin', icon: LayoutGrid, path: '/admin' },
        { id: 'admin-courses', label: 'Gestion des Cours', icon: FileText, path: '/admin/courses' },
        { id: 'admin-users', label: 'Utilisateurs', icon: Users, path: '/admin/users' },
        { id: 'admin-analytics', label: 'Analytics avancés', icon: BarChart3, path: '/admin/analytics' },
      ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <a href="/" className="sidebar-logo-link">
          <span className="sidebar-logo-text">Malloow</span>
          <span className="sidebar-logo-icon">M</span>
        </a>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            currentRoute === item.path ||
            (item.id === 'catalog' && (currentRoute.startsWith('/course') || currentRoute.startsWith('/lesson') || currentRoute.startsWith('/quiz'))) ||
            (item.id === 'admin-dashboard' && currentRoute === '/admin');

          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`sidebar-btn ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <IconComponent
                size={20}
                color={isActive ? 'var(--text-primary)' : 'var(--text-secondary)'}
              />
              <span className="sidebar-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
