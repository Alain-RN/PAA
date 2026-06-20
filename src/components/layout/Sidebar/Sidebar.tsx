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
  LogOut,
  Cpu,
  Flame,
  UserCheck,
  UserCog
} from 'lucide-react';
import Button from '../../ui/Button/Button';

export const Sidebar: React.FC = () => {
  const { currentUser, logout, login, usersList } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const currentRoute = location.pathname;
  const isStudent = currentUser.role === 'student';
  const isAdmin = currentUser.role === 'admin';

  // Quick switch role utility (extremely convenient for student defense demo)
  const toggleRole = () => {
    if (isStudent) {
      // Switch to admin
      const adminUser = usersList.find(u => u.role === 'admin');
      if (adminUser) {
        login(adminUser.email, 'admin');
        navigate('/admin');
      }
    } else {
      // Switch to student
      const studentUser = usersList.find(u => u.role === 'student');
      if (studentUser) {
        login(studentUser.email, 'student');
        navigate('/dashboard');
      }
    }
  };

  const navItems = isStudent
    ? [
      { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard' },
      { id: 'catalog', label: 'Mes Cours', icon: BookOpen, path: '/catalog' },
      { id: 'leaderboard', label: 'Classement', icon: Trophy, path: '/leaderboard' },
      { id: 'history', label: 'Historique', icon: History, path: '/history' },
      { id: 'profile', label: 'Mon Profil', icon: UserIcon, path: '/profile' },
    ]
    : [
      { id: 'admin-dashboard', label: 'Console Admin', icon: LayoutGrid, path: '/admin' },
      { id: 'admin-courses', label: 'Gestion des Cours', icon: FileText, path: '/admin/courses' },
      { id: 'admin-users', label: 'Utilisateurs', icon: Users, path: '/admin/users' },
      { id: 'admin-analytics', label: 'Analytics avancés', icon: BarChart3, path: '/admin/analytics' },
    ];

  const xpPercentage = isStudent ? (currentUser.xp / currentUser.xpNextLevel) * 100 : 0;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <Cpu size={22} color="var(--accent-primary)" />
        </div>
        <span style={styles.logoText}>AdaptLearn<span style={{ color: 'var(--accent-primary)' }}>.ia</span></span>
      </div>

      {/* Gamification widget in sidebar (Student only) */}
      {/* {isStudent && (
        <div style={styles.gamificationWidget}>
          <div className="flex-between mb-1">
            <span style={styles.studentName}>{currentUser.name}</span>
            <div style={styles.streakBadge} title="Série de jours actifs">
              <Flame size={14} color="var(--accent-warning)" fill="var(--accent-warning)" />
              <span>{currentUser.streak} j</span>
            </div>
          </div>
          <div className="flex-between mb-1" style={{ fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Niveau {currentUser.level}</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>
              {currentUser.xp} / {currentUser.xpNextLevel} XP
            </span>
          </div>
          <ProgressBar progress={xpPercentage} />
        </div>
      )} */}

      {/* Admin Widget */}
      {/* {isAdmin && (
        <div style={styles.adminWidget}>
          <div className="flex-between">
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-secondary)' }}>
              Mode Administration
            </span>
            <UserCog size={16} color="var(--accent-secondary)" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {currentUser.name}
          </div>
        </div>
      )} */}

      {/* Navigation */}
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

      {/* Footer Actions */}
      <div style={styles.footer}>
        {/* Quick Role Switcher (Crucial for Demo) */}
        <button onClick={toggleRole} style={styles.switchRoleBtn}>
          {isStudent ? (
            <>
              <UserCog size={16} color="var(--text-secondary)" />
              <span>Passer en Mode Admin</span>
            </>
          ) : (
            <>
              <UserCheck size={16} color="var(--text-secondary)" />
              <span>Passer en Mode Étudiant</span>
            </>
          )}
        </button>

        {/* Ollama AI Status Indicator */}
        <div className="ollama-status" style={{ width: '100%', justifyContent: 'center', margin: '0.5rem 0' }}>
          <div className="ollama-pulse"></div>
          <span>Ollama : Llama3 local connecté</span>
        </div>

        <Button variant="danger" onClick={logout} size="md">
          <LogOut size={16} />
          <span>Déconnexion</span>
        </Button>
      </div>
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
    padding: '1.5rem',
    zIndex: 100,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '2rem',
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
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.9rem 1rem',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    fontFamily: 'var(--font-primary)',
    fontSize: '15px',
    fontWeight: '700',
    position: 'relative',
    transition: 'var(--transition-smooth)',
    textTransform: 'uppercase'
  },
  navButtonActive: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid #74D0F1',
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
