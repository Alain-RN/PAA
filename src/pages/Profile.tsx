import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { GlassCard } from '../components/GlassCard';
import { 
  Award, Flame, Database, Cpu, TrendingUp, UserCheck, 
  Mail, Calendar, Shield, BookOpen, CheckSquare, Lock 
} from 'lucide-react';
import type { Badge } from '../types';

// Full list of badges for rendering the gallery
const ALL_BADGES_GALLERY: Badge[] = [
  { id: 'b1', name: 'Premier Pas', description: 'Création de votre compte sur la plateforme', icon: 'UserCheck', category: 'special' },
  { id: 'b2', name: 'Série de Feu', description: 'Maintenir une série d\'apprentissage de 5 jours', icon: 'Flame', category: 'streak' },
  { id: 'b3', name: 'Maître des Requêtes', description: 'Terminer tous les chapitres SQL', icon: 'Database', category: 'course' },
  { id: 'b4', name: 'Pionnier de l\'IA', description: 'Compléter le cours IA Locale Ollama', icon: 'Cpu', category: 'course' },
  { id: 'b5', name: 'Esprit Flexible', description: 'Réussir une transition de difficulté de Facile à Moyen en quiz', icon: 'TrendingUp', category: 'quiz' },
  { id: 'b6', name: 'Perfectionniste', description: 'Obtenir 100% de réussite sur un quiz adaptatif', icon: 'Award', category: 'quiz' },
];

export const Profile: React.FC = () => {
  const { currentUser, courses } = useAppState();

  if (!currentUser) return null;

  // Icon mapping helper
  const renderBadgeIcon = (iconName: string, isEarned: boolean) => {
    const color = isEarned ? 'var(--accent-warning)' : 'var(--text-muted)';
    const size = 32;

    switch (iconName) {
      case 'UserCheck': return <UserCheck size={size} color={isEarned ? 'var(--accent-primary)' : color} />;
      case 'Flame': return <Flame size={size} color={isEarned ? 'var(--accent-warning)' : color} fill={isEarned ? 'var(--accent-warning)' : 'none'} />;
      case 'Database': return <Database size={size} color={isEarned ? '#06b6d4' : color} />;
      case 'Cpu': return <Cpu size={size} color={isEarned ? 'var(--accent-secondary)' : color} />;
      case 'TrendingUp': return <TrendingUp size={size} color={isEarned ? 'var(--accent-success)' : color} />;
      case 'Award': return <Award size={size} color={isEarned ? '#fbbf24' : color} />;
      default: return <Award size={size} color={color} />;
    }
  };

  const totalChapters = courses.reduce((acc, c) => acc + c.chapters.length, 0);

  return (
    <div>
      <div style={styles.header}>
        <h1 className="font-heading" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Mon Profil Étudiant</h1>
        <p className="font-body" style={{ color: 'var(--text-secondary)' }}>
          Gérez votre profil, suivez vos statistiques académiques et admirez vos badges de réussite.
        </p>
      </div>

      <div style={styles.layout}>
        {/* Left Column: Personal info & Quick Stats */}
        <div style={{ flex: 0.9, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Info Card */}
          <GlassCard style={styles.infoCard}>
            <div style={styles.avatar}>
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <h2 className="font-heading" style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{currentUser.name}</h2>
            <div style={styles.roleTag}>Étudiant</div>
            
            <div style={styles.detailsList}>
              <div style={styles.detailItem}>
                <Mail size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '0.85rem' }}>{currentUser.email}</span>
              </div>
              <div style={styles.detailItem}>
                <Calendar size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '0.85rem' }}>Inscrit le {currentUser.dateJoined}</span>
              </div>
              <div style={styles.detailItem}>
                <Shield size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '0.85rem' }}>Université de Licence Informatique</span>
              </div>
            </div>
          </GlassCard>

          {/* Stats Summary Card */}
          <GlassCard>
            <h3 className="font-heading" style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Statistiques d'apprentissage</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <Flame size={20} color="var(--accent-warning)" fill="var(--accent-warning)" />
                <div className="streak-count" style={styles.statVal}>{currentUser.streak} jours</div>
                <div style={styles.statLbl}>Série actuelle</div>
              </div>

              <div style={styles.statBox}>
                <BookOpen size={20} color="var(--accent-primary)" />
                <div className="font-xp" style={styles.statVal}>
                  {currentUser.completedChapters.length} / {totalChapters}
                </div>
                <div style={styles.statLbl}>Leçons lues</div>
              </div>

              <div style={styles.statBox}>
                <CheckSquare size={20} color="var(--accent-success)" />
                <div className="font-xp" style={styles.statVal}>
                  {currentUser.completedChapters.length}
                </div>
                <div style={styles.statLbl}>Quiz réussis</div>
              </div>

              <div style={styles.statBox}>
                <Award size={20} color="var(--accent-secondary)" />
                <div className="font-xp" style={styles.statVal}>{currentUser.badges.length}</div>
                <div style={styles.statLbl}>Badges obtenus</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Badges Gallery */}
        <div style={{ flex: 1.1 }}>
          <GlassCard style={{ height: '100%' }}>
            <h3 className="font-heading" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Galerie des Badges</h3>
            <p className="font-body" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              Relevez des défis de cours, de streaks ou de niveau pour débloquer ces succès.
            </p>

            <div style={styles.badgesGrid}>
              {ALL_BADGES_GALLERY.map((badge) => {
                // Check if user earned this badge
                const userBadge = currentUser.badges.find(b => b.id === badge.id);
                const isEarned = !!userBadge;

                return (
                  <div
                    key={badge.id}
                    style={{
                      ...styles.badgeCard,
                      opacity: isEarned ? 1 : 0.45,
                      borderColor: isEarned ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <div style={styles.badgeIconWrapper}>
                      {renderBadgeIcon(badge.icon, isEarned)}
                      {!isEarned && (
                        <div style={styles.lockIcon} title="Badge verrouillé">
                          <Lock size={12} color="#fff" />
                        </div>
                      )}
                    </div>
                    
                    <h4 className="font-heading" style={styles.badgeName}>{badge.name}</h4>
                    <p className="font-body" style={styles.badgeDesc}>{badge.description}</p>
                    
                    {isEarned && (
                      <span style={styles.earnedAtLabel}>
                        Débloqué le {userBadge.earnedAt || '15/06/2026'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '2rem',
  },
  layout: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  infoCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '2rem 1.5rem',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '1rem',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  roleTag: {
    fontSize: '0.75rem',
    fontWeight: 600,
    background: 'rgba(99, 102, 241, 0.15)',
    color: 'var(--accent-primary)',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    marginBottom: '1.5rem',
  },
  detailsList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    borderTop: '1px solid var(--glass-border)',
    paddingTop: '1.25rem',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textAlign: 'left',
    color: 'var(--text-secondary)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  statBox: {
    background: 'rgba(0,0,0,0.15)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
    padding: '1rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statVal: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    margin: '0.35rem 0 0.15rem 0',
  },
  statLbl: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: 550,
  },
  badgesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  badgeCard: {
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
    padding: '1.25rem 0.75rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'var(--transition-smooth)',
  },
  badgeIconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--glass-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.75rem',
    position: 'relative',
  },
  lockIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    background: 'var(--accent-danger)',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 5px rgba(0,0,0,0.5)',
  },
  badgeName: {
    fontSize: '0.85rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
  },
  badgeDesc: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.3',
    flex: 1,
  },
  earnedAtLabel: {
    fontSize: '0.65rem',
    color: 'var(--accent-warning)',
    marginTop: '0.75rem',
    fontWeight: 550,
  },
};

export default Profile;
