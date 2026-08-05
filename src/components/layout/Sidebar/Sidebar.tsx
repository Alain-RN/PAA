import React from 'react';
import { useAppState } from '../../../hooks/useAppState';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
// import { ProgressBar } from '../../ui/ProgressBar';
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
  const { currentUser, logout, login, usersList } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const currentRoute = location.pathname;
  const isStudent = currentUser.role === 'student';
  const isAdmin = currentUser.role === 'admin';

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
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <a href="" style={{ color: '#49c0f8', fontSize: '30px', letterSpacing: "0.02em", fontWeight: '900', textDecoration: 'none', marginLeft: "0.9rem", marginTop: "8px" }}>
          Malloow
        </a>
      </div>
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const isActive =
            currentRoute === item.path ||
            (item.id === 'catalog' && (currentRoute.startsWith('/course') || currentRoute.startsWith('/lesson') || currentRoute.startsWith('/quiz'))) ||
            (item.id === 'admin-dashboard' && currentRoute === '/admin');

          const IconComponent = item.icon;

          return (
            <button
              className='btn-sidebar'
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navButton,
                ...(isActive ? styles.navButtonActive : {})
              }}
            >
              <IconComponent
                size={18}
                color={isActive ? 'var(--text-primary)' : 'var(--text-secondary)'}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 'var(--sidebar-width)',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    background: 'var(--bg-mode)',
    backdropFilter: 'blur(20px)',
    borderRight: '2px solid var(--glass-border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    zIndex: 100,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.4rem',
  },
  logoIcon: {
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '10px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)',
  },
  logoText: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 800,
    fontSize: '1.25rem',
    letterSpacing: '-0.03em',
  },
  gamificationWidget: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  adminWidget: {
    background: 'rgba(168, 85, 247, 0.05)',
    border: '1px solid rgba(168, 85, 247, 0.15)',
    borderRadius: 'var(--border-radius-md)',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  studentName: {
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  streakBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    padding: '0.15rem 0.4rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--accent-warning)',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  navButton: {
    border: '2px solid transparent',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.9rem 1rem',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    fontSize: '0.9rem',
    position: 'relative',
    transition: 'var(--transition-smooth)',
    textTransform: 'uppercase'
  },
  navButtonActive: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid var(--glass-border-focus)',
    borderRadius: '12px',
    color: '#74D0F1',
    textTransform: 'uppercase'
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '25%',
    height: '50%',
    width: '3px',
    backgroundColor: 'var(--accent-primary)',
    borderRadius: '0 4px 4px 0',
    boxShadow: '0 0 8px var(--accent-primary)',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: 'auto',
    borderTop: '1px solid var(--glass-border)',
    paddingTop: '1rem',
  },
  switchRoleBtn: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'var(--transition-smooth)',
  },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    width: '100%',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)',
  },
};

export default Sidebar;
