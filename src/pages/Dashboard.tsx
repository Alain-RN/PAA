import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { useAI } from '../hooks/useAI';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { ProgressBar } from '../components/ProgressBar';
import { Brain, ArrowRight, Flame, Award, BookOpen, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, courses } = useAppState();
  const { recommendation } = useAI();
  const navigate = useNavigate();

  if (!currentUser) return null;

  // Compute stats
  const totalChapters = courses.reduce((acc, c) => acc + c.chapters.length, 0);
  const completedChaptersCount = currentUser.completedChapters.length;
  const progressRatio = (completedChaptersCount / (totalChapters || 1)) * 100;

  return (
    <div>
      {/* Top Banner */}
      <div style={styles.header}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
            Ravi de vous revoir, {currentUser.name} ! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Prêt à poursuivre vos défis d'apprentissage aujourd'hui ?
          </p>
        </div>
        <div style={styles.headerStats}>
          <div style={styles.headerStatItem}>
            <Flame size={20} color="var(--accent-warning)" fill="var(--accent-warning)" />
            <div>
              <div style={styles.statValue}>{currentUser.streak} jours</div>
              <div style={styles.statLabel}>Série active</div>
            </div>
          </div>
          <div style={styles.headerStatItem}>
            <Award size={20} color="var(--accent-secondary)" />
            <div>
              <div style={styles.statValue}>{currentUser.badges.length} badges</div>
              <div style={styles.statLabel}>Débloqués</div>
            </div>
          </div>
        </div>
      </div>

      {/* IA Recommendation Widget - CRITICAL FOR DEFENSE DEMO */}
      <div style={styles.section}>
      </div>

      {/* Grid Stats & Course List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        
        {/* Left Column: My Current Courses */}
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="var(--accent-primary)" />
            <span>Mes cours en cours</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {courses.map((course) => {
              const courseChapterIds = course.chapters.map(ch => ch.id);
              const completedCount = courseChapterIds.filter(id => currentUser.completedChapters.includes(id)).length;
              const progress = Math.round((completedCount / courseChapterIds.length) * 100);

              return (
                <GlassCard key={course.id} style={styles.courseCard}>
                  <div className="flex-between mb-1">
                    <span style={styles.courseCategory}>{course.category}</span>
                    <span style={{
                      ...styles.courseDifficulty,
                      backgroundColor: 
                        course.difficulty === 'Débutant' ? 'rgba(16, 185, 129, 0.15)' : 
                        course.difficulty === 'Intermédiaire' ? 'rgba(245, 158, 11, 0.15)' : 
                        'rgba(239, 68, 68, 0.15)',
                      color:
                        course.difficulty === 'Débutant' ? 'var(--accent-success)' : 
                        course.difficulty === 'Intermédiaire' ? 'var(--accent-warning)' : 
                        'var(--accent-danger)'
                    }}>
                      {course.difficulty}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{course.title}</h3>
                  <p style={styles.courseDesc}>{course.description}</p>
                  
                  <div style={{ marginTop: '1.5rem' }}>
                    <ProgressBar progress={progress} showPercentage label="Progression" />
                  </div>
                  
                  <div className="flex-between" style={{ marginTop: '1.25rem', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {completedCount} sur {course.chapters.length} chapitres terminés
                    </span>
                    <button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    >
                      Voir le cours
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Right Column: Mini Stats and Quick Logs */}
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--accent-secondary)" />
            <span>Vue globale</span>
          </h2>
          <GlassCard style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Progression globale académique
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <ProgressBar progress={progressRatio} showPercentage label="Chapitres validés" />
              </div>
              <div style={styles.miniStatGrid}>
                <div style={styles.miniStatCard}>
                  <div style={styles.miniStatVal}>{completedChaptersCount}</div>
                  <div style={styles.miniStatLbl}>Chapitres</div>
                </div>
                <div style={styles.miniStatCard}>
                  <div style={styles.miniStatVal}>{currentUser.completedCourses.length}</div>
                  <div style={styles.miniStatLbl}>Diplômes</div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex-between mb-1">
              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Activité récente</h3>
              <button onClick={() => navigate('/history')} style={styles.seeAllBtn}>
                Tout voir
              </button>
            </div>
            
            <div style={styles.miniLogsList}>
              {currentUser.completedChapters.slice(-3).reverse().map((chId, idx) => (
                <div key={idx} style={styles.miniLogItem}>
                  <div style={styles.miniLogIndicator} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Chapitre validé</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {chId === 'c1_ch1' ? 'Introduction aux SGBDR' : chId === 'c1_ch2' ? 'Sélection des données' : 'Chapitre validé'}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: 'bold' }}>
                    +30 XP
                  </div>
                </div>
              ))}
              {currentUser.completedChapters.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                  Aucune activité récente. Démarrer un cours pour commencer !
                </p>
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerStats: {
    display: 'flex',
    gap: '1.5rem',
  },
  headerStatItem: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-md)',
    padding: '0.75rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  statValue: {
    fontSize: '1rem',
    fontWeight: 700,
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  section: {
    marginBottom: '1.5rem',
  },
  recommendationCard: {
    border: "none"
  },
  recommendationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.25rem',
  },
  iaIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
  },
  iaTag: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '4px',
    padding: '0.1rem 0.4rem',
    fontSize: '0.65rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.8)',
  },
  recommendationBody: {
    paddingLeft: '0.5rem',
  },
  recommendationText: {
    fontSize: '0.95rem',
    lineHeight: '1.5',
    color: 'var(--text-primary)',
    marginBottom: '1rem',
  },
  recommendationBox: {
    background: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.75rem 1rem',
    maxWidth: '500px',
  },
  courseCard: {
    padding: '1.5rem',
  },
  courseCategory: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: 'var(--accent-primary)',
    letterSpacing: '0.05em',
  },
  courseDifficulty: {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
  },
  courseDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    marginBottom: '1rem',
  },
  miniStatGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  miniStatCard: {
    background: 'rgba(0,0,0,0.15)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.5rem',
    textAlign: 'center',
  },
  miniStatVal: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  miniStatLbl: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  seeAllBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--accent-primary)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontWeight: 500,
  },
  miniLogsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  miniLogItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  miniLogIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-primary)',
    boxShadow: '0 0 6px var(--accent-primary)',
  },
};

export default Dashboard;
