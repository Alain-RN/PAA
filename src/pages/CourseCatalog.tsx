import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { ProgressBar } from '../components/ProgressBar';
import { BookOpen, Sparkles, Award } from 'lucide-react';

export const CourseCatalog: React.FC = () => {
  const { currentUser, courses } = useAppState();
  const navigate = useNavigate();

  if (!currentUser) return null;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Catalogue des Cours</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Explorez nos parcours d'apprentissage adaptatifs. L'IA adapte l'évaluation et vous recommande des révisions.
        </p>
      </div>

      <div style={styles.grid}>
        {courses.map((course) => {
          const courseChapterIds = course.chapters.map((ch) => ch.id);
          const completedCount = courseChapterIds.filter((id) =>
            currentUser.completedChapters.includes(id)
          ).length;
          const progress = Math.round((completedCount / courseChapterIds.length) * 100);
          const isCompleted = progress === 100;

          return (
            <GlassCard key={course.id} interactive style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.category}>{course.category}</span>
                <span
                  style={{
                    ...styles.difficulty,
                    backgroundColor:
                      course.difficulty === 'Débutant'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : course.difficulty === 'Intermédiaire'
                        ? 'rgba(245, 158, 11, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)',
                    color:
                      course.difficulty === 'Débutant'
                        ? 'var(--accent-success)'
                        : course.difficulty === 'Intermédiaire'
                        ? 'var(--accent-warning)'
                        : 'var(--accent-danger)',
                  }}
                >
                  {course.difficulty}
                </span>
              </div>

              <h2 style={styles.title}>{course.title}</h2>
              <p style={styles.description}>{course.description}</p>

              <div style={styles.stats}>
                <div style={styles.statItem}>
                  <BookOpen size={16} color="var(--text-muted)" />
                  <span>{course.chapters.length} chapitres</span>
                </div>
                <div style={styles.statItem}>
                  <Award size={16} color="var(--accent-warning)" />
                  <span>+{course.xpReward} XP récompense</span>
                </div>
              </div>

              <div style={styles.progressContainer}>
                <ProgressBar progress={progress} showPercentage label="Votre progression" />
              </div>

              <div style={styles.cardFooter}>
                {isCompleted ? (
                  <span style={styles.completedBadge}>
                    <Sparkles size={14} />
                    <span>Complété !</span>
                  </span>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {completedCount} chapitres complétés
                  </span>
                )}
                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                >
                  {progress > 0 ? 'Continuer' : 'Démarrer'}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  category: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: 'var(--accent-primary)',
    letterSpacing: '0.05em',
  },
  difficulty: {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
  },
  title: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
    lineHeight: '1.3',
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    lineHeight: '1.45',
    marginBottom: '1.25rem',
    flex: 1,
  },
  stats: {
    display: 'flex',
    gap: '1.25rem',
    marginBottom: '1.25rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  progressContainer: {
    marginBottom: '1.5rem',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '1rem',
    borderTop: '1px solid var(--glass-border)',
  },
  completedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    color: 'var(--accent-success)',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
};

export default CourseCatalog;
