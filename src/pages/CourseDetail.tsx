import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { BookOpen, CheckCircle2, HelpCircle, ArrowLeft } from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentUser, courses } = useAppState();

  if (!currentUser) return null;

  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return (
      <div>
        <h2>Cours introuvable</h2>
        <button onClick={() => navigate('/catalog')} className="btn btn-secondary">
          Retour au catalogue
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate('/catalog')}
        className="btn btn-secondary mb-2"
        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
      >
        <ArrowLeft size={14} />
        <span>Retour au catalogue</span>
      </button>

      <div style={styles.header}>
        <span style={styles.category}>{course.category}</span>
        <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>{course.title}</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: '1.5' }}>
          {course.description}
        </p>
      </div>

      <div style={styles.layout}>
        {/* Left: Chapter list */}
        <div style={{ flex: 1 }}>
          <h2 style={styles.sectionTitle}>Syllabus du cours</h2>
          
          <div style={styles.chaptersList}>
            {course.chapters.map((chapter, idx) => {
              const isCompleted = currentUser.completedChapters.includes(chapter.id);
              const isWeak = currentUser.weakChapters.includes(chapter.id);

              return (
                <GlassCard key={chapter.id} style={{
                  ...styles.chapterItem,
                  borderColor: isWeak ? 'rgba(239, 68, 68, 0.3)' : 'var(--glass-border)',
                  boxShadow: isWeak ? '0 0 15px rgba(239, 68, 68, 0.05)' : 'none',
                }}>
                  <div style={styles.chapterMain}>
                    <div style={{
                      ...styles.chapterNumber,
                      backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                      color: isCompleted ? 'var(--accent-success)' : 'var(--text-secondary)',
                      borderColor: isCompleted ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border)',
                    }}>
                      {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={styles.chapterTitleRow}>
                        <h3 style={styles.chapterTitle}>{chapter.title}</h3>
                        {isWeak && <span style={styles.weakBadge}>À réviser (Recommandé IA)</span>}
                      </div>
                      <p style={styles.chapterSummary}>{chapter.summaryByAI.substring(0, 110)}...</p>
                    </div>
                  </div>

                  <div style={styles.chapterActions}>
                    <button
                      onClick={() => navigate(`/lesson/${course.id}/${chapter.id}`)}
                      className="btn btn-secondary"
                      style={styles.actionBtn}
                    >
                      <BookOpen size={14} />
                      <span>Lire le cours</span>
                    </button>

                    <button
                      onClick={() => navigate(`/quiz/${course.id}/${chapter.id}`)}
                      className="btn btn-primary"
                      style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)' }}
                    >
                      <HelpCircle size={14} />
                      <span>Quiz adaptatif</span>
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Right: Course stats details */}
        <div style={styles.sidebar}>
          <GlassCard>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Récompense Académique</h3>
            <div style={styles.rewardBox}>
              <div style={styles.rewardVal}>+{course.xpReward} XP</div>
              <div style={styles.rewardLbl}>lors de la complétion totale</div>
            </div>
            
            <div style={styles.rulesBox}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Règles de l'évaluation adaptative :
              </h4>
              <ul style={styles.rulesList}>
                <li>Les questions changent de difficulté en fonction de vos réponses en direct.</li>
                <li>Si vous obtenez plus de 80%, le cours est validé et vous débloquez des XP supplémentaires.</li>
                <li>Si vous obtenez moins de 50%, l'IA locale Ollama active une alerte de révision sur votre tableau de bord.</li>
              </ul>
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
  category: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: 'var(--accent-primary)',
    letterSpacing: '0.05em',
  },
  layout: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
  },
  chaptersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  chapterItem: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  chapterMain: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  chapterNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    border: '1px solid var(--glass-border)',
  },
  chapterTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
    marginBottom: '0.25rem',
  },
  chapterTitle: {
    fontSize: '1.05rem',
    fontWeight: 600,
  },
  weakBadge: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: 'var(--accent-danger)',
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
  },
  chapterSummary: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  chapterActions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
    paddingTop: '0.75rem',
  },
  actionBtn: {
    padding: '0.45rem 0.9rem',
    fontSize: '0.8rem',
  },
  sidebar: {
    width: '300px',
  },
  rewardBox: {
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: 'var(--border-radius-md)',
    padding: '1rem',
    textAlign: 'center',
    marginBottom: '1.25rem',
  },
  rewardVal: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--accent-primary)',
  },
  rewardLbl: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  rulesBox: {
    borderTop: '1px solid var(--glass-border)',
    paddingTop: '1rem',
  },
  rulesList: {
    paddingLeft: '1.2rem',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
};

export default CourseDetail;
