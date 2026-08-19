import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { ProgressBar } from '../components/ProgressBar';
import { BookOpen, ChevronRight, Star } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, courses } = useAppState();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const difficultyConfig = {
    'Débutant':     { bg: 'rgba(16,185,129,0.12)', color: 'var(--accent-success)' },
    'Intermédiaire':{ bg: 'rgba(245,158,11,0.12)', color: 'var(--accent-warning)' },
    'Avancé':       { bg: 'rgba(239,68,68,0.12)',  color: 'var(--accent-danger)'  },
  } as const;

  return (
    <div style={styles.page}>

      {/* ── HEADER ── */}
      <div style={styles.header}>
        <div>
          <h1 className="font-heading" style={styles.title}>
            Bonjour, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="font-body" style={styles.subtitle}>
            Continuez là où vous vous êtes arrêté.
          </p>
        </div>

      </div>

      {/* ── SECTION TITRE ── */}
      <div style={styles.sectionHeader}>
        <BookOpen size={18} color="var(--accent-primary)" />
        <h2 className="font-heading" style={styles.sectionTitle}>Mes cours</h2>
      </div>

      {/* ── COURSE CARDS ── */}
      <div style={styles.courseList}>
        {courses.map((course) => {
          const ids = course.chapters.map(ch => ch.id);
          const done = ids.filter(id => currentUser.completedChapters.includes(id)).length;
          const progress = Math.round((done / ids.length) * 100);
          const diff = difficultyConfig[course.difficulty as keyof typeof difficultyConfig]
            ?? { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' };

          return (
            <GlassCard key={course.id} style={styles.courseCard}>
              {/* Left: info */}
              <div style={styles.courseLeft}>
                <div style={styles.courseTopRow}>
                  <span style={{ ...styles.categoryTag }}>
                    {course.category}
                  </span>
                  <span style={{ ...styles.diffTag, background: diff.bg, color: diff.color }}>
                    {course.difficulty}
                  </span>
                </div>
                <h3 className="font-heading" style={styles.courseTitle}>{course.title}</h3>
                <div style={styles.courseProgress}>
                  <ProgressBar progress={progress} showPercentage label={`${done}/${ids.length} chapitres`} />
                </div>
              </div>

              {/* Right: CTA */}
              <button
                onClick={() => navigate(`/course/${course.id}`)}
                className="btn btn-primary"
                style={styles.courseBtn}
              >
                {progress > 0 ? 'Continuer' : 'Démarrer'}
                <ChevronRight size={16} />
              </button>
            </GlassCard>
          );
        })}
      </div>

      {/* ── ACTIVITÉ RÉCENTE ── */}
      {currentUser.completedChapters.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={styles.sectionHeader}>
            <Star size={18} color="var(--accent-warning)" />
            <h2 className="font-heading" style={styles.sectionTitle}>Activité récente</h2>
            <button onClick={() => navigate('/history')} style={styles.linkBtn}>
              Tout voir →
            </button>
          </div>

          <div style={styles.activityRow}>
            {currentUser.completedChapters.slice(-4).reverse().map((chId, idx) => {
              const chapterNames: Record<string, string> = {
                c1_ch1: 'Introduction aux SGBDR',
                c1_ch2: 'Sélection des données',
                c1_ch3: 'Jointures & Agrégats',
              };
              return (
                <div key={idx} style={styles.activityChip}>
                  <div style={styles.activityDot} />
                  <div>
                    <div style={styles.activityName}>
                      {chapterNames[chId] ?? 'Chapitre validé'}
                    </div>
                    <div className="font-xp" style={styles.activityXp}>+30 XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    width: '100%',
  },

  /* Header */
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.9rem',
    marginBottom: '0.2rem',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },

  /* Stat pills */
  pills: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--glass-border)',
    borderRadius: '999px',
    padding: '0.45rem 1rem',
  },
  pillValue: {
    fontWeight: 700,
    fontSize: '0.95rem',
  },
  pillLabel: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
  },

  /* Section header */
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.85rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    flex: 1,
  },
  linkBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--accent-primary)',
    fontSize: '0.82rem',
    cursor: 'pointer',
    fontWeight: 500,
  },

  /* Course cards */
  courseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  courseCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.1rem 1.25rem',
  },
  courseLeft: {
    flex: 1,
    minWidth: 0,
  },
  courseTopRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.4rem',
  },
  categoryTag: {
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    color: 'var(--accent-primary)',
    letterSpacing: '0.05em',
  },
  diffTag: {
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '0.1rem 0.45rem',
    borderRadius: '5px',
  },
  courseTitle: {
    fontSize: '1rem',
    marginBottom: '0.6rem',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  courseProgress: {
    maxWidth: '420px',
  },
  courseBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    flexShrink: 0,
    padding: '0.5rem 1rem',
    fontSize: '0.82rem',
  },

  /* Activity */
  activityRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
    gap: '0.75rem',
  },
  activityChip: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.6rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: '10px',
    padding: '0.75rem',
  },
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-primary)',
    boxShadow: '0 0 6px var(--accent-primary)',
    marginTop: '4px',
    flexShrink: 0,
  },
  activityName: {
    fontSize: '0.82rem',
    fontWeight: 500,
    marginBottom: '0.2rem',
    color: 'var(--text-primary)',
  },
  activityXp: {
    fontSize: '0.75rem',
    color: 'var(--accent-success)',
  },
};

export default Dashboard;
