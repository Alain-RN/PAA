import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { useAI } from '../hooks/useAI';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Sparkles, Brain, Check, HelpCircle, ArrowLeft, Terminal } from 'lucide-react';

export const LessonView: React.FC = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { currentUser, courses, completeChapter } = useAppState();
  const { useTypewriter } = useAI();
  const [triggerAI, setTriggerAI] = useState(false);

  if (!currentUser || !courseId || !chapterId) return null;

  const course = courses.find((c) => c.id === courseId);
  const chapter = course?.chapters.find((ch) => ch.id === chapterId);

  if (!course || !chapter) {
    return (
      <div>
        <h2>Leçon introuvable</h2>
        <button onClick={() => navigate('/catalog')} className="btn btn-secondary">
          Retour au catalogue
        </button>
      </div>
    );
  }

  const isCompleted = currentUser.completedChapters.includes(chapterId);

  // Typewriter text generator
  const { displayedText, isGenerating } = useTypewriter(
    `[Ollama Llama3-8B local] RÉSUMÉ PÉDAGOGIQUE DU CHAPITRE :
• Objectif principal : comprendre comment structurer ou manipuler les données efficacement.
• Point clé 1 : ${
      chapterId === 'c1_ch1'
        ? 'Les tables relationnelles s\'appuient sur des clés primaires uniques pour l\'identification, et des clés étrangères pour lier les entités.'
        : chapterId === 'c1_ch2'
        ? 'SELECT filtre verticalement (colonnes) tandis que WHERE filtre horizontalement (lignes). ORDER BY gère le tri.'
        : 'Les jointures JOIN lient les lignes, GROUP BY effectue les agrégats de groupe, et HAVING filtre les résultats de calculs groupés.'
    }
• Conseil de l'IA : Mémorisez la syntaxe et testez toujours la cardinalité de vos relations pour éviter les requêtes lentes ou les doublons.`,
    15,
    triggerAI
  );

  const handleMarkAsCompleted = () => {
    completeChapter(courseId, chapterId);
  };

  return (
    <div>
      {/* Navigation */}
      <button
        onClick={() => navigate(`/course/${courseId}`)}
        className="btn btn-secondary mb-2"
        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
      >
        <ArrowLeft size={14} />
        <span>Retour au cours</span>
      </button>

      <div style={styles.header}>
        <span style={styles.category}>{course.title}</span>
        <h1 className="font-heading" style={{ fontSize: '1.8rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
          {chapter.title}
        </h1>
      </div>

      <div style={styles.layout}>
        {/* Course Text Content */}
        <div style={{ flex: 1.2 }}>
          <GlassCard style={styles.lessonCard}>
            {/* Formatted body */}
            <div style={styles.contentBody}>
              {chapter.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('`SELECT') || paragraph.startsWith('SELECT') || paragraph.startsWith('`const') || paragraph.startsWith('const')) {
                  return (
                    <div key={idx} style={styles.codeBlock}>
                      <div style={styles.codeHeader}>
                        <Terminal size={14} color="var(--text-muted)" />
                        <span>Code Source</span>
                      </div>
                      <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        <code>{paragraph.replace(/`/g, '')}</code>
                      </pre>
                    </div>
                  );
                }
                return (
                  <p className="font-body" key={idx} style={{ marginBottom: '1.25rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Complete Actions */}
            <div style={styles.completionRow}>
              {isCompleted ? (
                <div style={styles.successBadge}>
                  <Check size={16} />
                  <span>Chapitre terminé (+30 XP)</span>
                </div>
              ) : (
                <button onClick={handleMarkAsCompleted} className="btn btn-accent">
                  <Check size={16} />
                  <span>Valider la lecture (+30 XP)</span>
                </button>
              )}

              <button
                onClick={() => navigate(`/quiz/${courseId}/${chapterId}`)}
                className="btn btn-primary"
              >
                <HelpCircle size={16} />
                <span>Quiz d'adaptation</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* AI Sidebar */}
        <div style={styles.sidebar}>
          <GlassCard style={styles.aiCard}>
            <div style={styles.aiCardHeader}>
              <div style={styles.aiLogo}>
                <Brain size={18} color="#fff" />
              </div>
              <div>
                <div className="font-ui" style={{ fontWeight: 700, fontSize: '0.95rem' }}>Assistant IA Ollama</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mistral-7B local offline</div>
              </div>
            </div>

            <p className="font-body" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
              Générez un résumé instantané de ce cours exécuté localement sur votre machine sans connexion internet.
            </p>

            {!triggerAI && !isGenerating && (
              <button
                onClick={() => setTriggerAI(true)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
              >
                <Sparkles size={14} color="var(--accent-warning)" />
                <span>Résumer le cours par l'IA</span>
              </button>
            )}

            {(triggerAI || isGenerating) && (
              <div style={styles.aiOutputBox}>
                {isGenerating && (
                  <div style={styles.generatingBadge}>
                    <div style={styles.spinner} />
                    <span>Génération locale...</span>
                  </div>
                )}
                <div style={styles.aiText}>
                  {displayedText}
                  {isGenerating && <span className="typewriter-cursor">|</span>}
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '1.5rem',
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
  lessonCard: {
    padding: '2rem 1.5rem',
  },
  contentBody: {
    color: 'var(--text-primary)',
  },
  codeBlock: {
    background: '#040711',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '1rem',
    margin: '1.5rem 0',
    overflowX: 'auto',
  },
  codeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.5rem',
    marginBottom: '0.75rem',
    fontWeight: 600,
  },
  completionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2.5rem',
    borderTop: '1px solid var(--glass-border)',
    paddingTop: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  successBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--accent-success)',
    padding: '0.6rem 1.2rem',
    borderRadius: 'var(--border-radius-sm)',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  sidebar: {
    width: '300px',
  },
  aiCard: {
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
  },
  aiCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  aiLogo: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)',
  },
  aiOutputBox: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.85rem',
    marginTop: '1rem',
  },
  generatingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.7rem',
    color: 'var(--accent-secondary)',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  spinner: {
    width: '10px',
    height: '10px',
    border: '2px solid rgba(168, 85, 247, 0.2)',
    borderTop: '2px solid var(--accent-secondary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  aiText: {
    fontSize: '0.8rem',
    lineHeight: '1.45',
    whiteSpace: 'pre-line',
    color: 'var(--text-primary)',
  },
};

export default LessonView;
