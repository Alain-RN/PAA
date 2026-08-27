import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { generateCourseWithAI } from '../services/aiService';
import { Card, Button, Input } from '../components/ui';
import { Sparkles, X, CheckCircle2, BookOpen, ChevronRight, Layers, Search } from 'lucide-react';
import type { Course, Question } from '../types';

interface Props {
  onClose: () => void;
}

type Step = 'form' | 'generating' | 'preview';

const LOADING_MESSAGES = [
  'Analyse du sujet demandée...',
  'Génération de la structure du cours...',
  'Rédaction des chapitres...',
  'Création des QCMs adaptatifs...',
  'Finalisation...',
];

export const AICourseGenerator: React.FC<Props> = ({ onClose }) => {
  const { addCourse, addQuestionsForChapter } = useAppState();

  const [step, setStep] = useState<Step>('form');
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedCourse, setGeneratedCourse] = useState<Course | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Record<string, Question[]>>({});

  const [title, setTitle] = useState('');
  const [nbChapters, setNbChapters] = useState<number>(6);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setStep('generating');
    setError(null);

    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1400);

    try {
      const result = await generateCourseWithAI({
        title,
        category: 'Informatique',
        difficulty: 'Débutant',
        nbChapters,
      });
      clearInterval(interval);
      setGeneratedCourse(result.course);
      setGeneratedQuestions(result.questionsByChapter);
      setStep('preview');
    } catch {
      clearInterval(interval);
      setError('Une erreur est survenue lors de la génération. Veuillez réessayer.');
      setStep('form');
    }
  };

  const handleConfirm = () => {
    if (!generatedCourse) return;
    addCourse(generatedCourse);
    Object.entries(generatedQuestions).forEach(([chapterId, questions]) => {
      addQuestionsForChapter(chapterId, questions);
    });
    onClose();
  };

  return (
    <div style={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Card style={styles.modalCard} padding="lg">
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconBox}>
              <Sparkles size={20} color="var(--accent-primary)" />
            </div>
            <div>
              <h2 className="font-heading" style={styles.headerTitle}>
                Créer un cours avec l'IA
              </h2>
              <p className="font-body" style={styles.headerSubtitle}>
                🚀 Spécialité <strong>Tech & Code</strong> — et bien plus encore.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: SINGLE INPUT FORM */}
        {step === 'form' && (
          <form onSubmit={handleGenerate} style={styles.formBody}>
            {error && (
              <div style={styles.errorBox}>
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Sujet du cours"
              iconLeft={<Search size={16} />}
              placeholder="Ex: TypeScript, Python, SQL & PostgreSQL, React, DevOps, Rust... ou autre chose !"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Nombre de chapitres
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {[5, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNbChapters(num)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: nbChapters === num ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                      backgroundColor: nbChapters === num ? 'rgba(73, 192, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      color: nbChapters === num ? 'var(--accent-primary)' : 'var(--text-primary)',
                      fontWeight: nbChapters === num ? 700 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {num} chap.
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.footerActions}>
              <Button type="button" variant="secondary" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" variant="primary" iconLeft={<Sparkles size={16} />}>
                Générer le cours ({nbChapters} chapitres)
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: GENERATING */}
        {step === 'generating' && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinnerOuter}>
              <div style={styles.spinnerRing} />
              <Sparkles size={24} color="var(--accent-primary)" style={{ position: 'absolute' }} />
            </div>
            <h3 className="font-heading" style={styles.loadingTitle}>
              Génération du cours en cours...
            </h3>
            <p className="font-body" style={styles.loadingSubtitle}>
              {LOADING_MESSAGES[loadingMsgIdx]}
            </p>
          </div>
        )}

        {/* STEP 3: PREVIEW */}
        {step === 'preview' && generatedCourse && (
          <div style={styles.previewBody}>
            <div style={styles.successBanner}>
              <CheckCircle2 size={16} color="var(--accent-success)" />
              <span>Votre cours a été généré avec succès !</span>
            </div>

            <div style={styles.previewHeader}>
              <h3 className="font-heading" style={styles.coursePreviewTitle}>
                {generatedCourse.title}
              </h3>
              <p className="font-body" style={styles.coursePreviewDesc}>
                {generatedCourse.description}
              </p>
            </div>

            <div style={styles.chapterList}>
              <div style={styles.chapterListTitle}>
                <Layers size={14} color="var(--text-secondary)" />
                <span>Chapitres générés ({generatedCourse.chapters.length})</span>
              </div>
              {generatedCourse.chapters.map((ch, idx) => (
                <div key={ch.id} style={styles.chapterCard}>
                  <div style={styles.chapterIndex}>{idx + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.chapterTitleText}>{ch.title}</div>
                    <div style={styles.chapterSummaryText}>{ch.summaryByAI}</div>
                  </div>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>

            <div style={styles.footerActions}>
              <Button type="button" variant="secondary" onClick={() => setStep('form')} iconLeft={<BookOpen size={16} />}>
                Modifier
              </Button>
              <Button type="button" variant="primary" onClick={handleConfirm} iconLeft={<CheckCircle2 size={16} />}>
                Ajouter à mes cours
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 10, 20, 0.75)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modalCard: {
    maxWidth: '500px',
    width: '100%',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--glass-border)',
    boxShadow: 'var(--shadow-lg)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: '1.25rem',
    marginBottom: '1.25rem',
    borderBottom: '1px solid var(--glass-border)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
  },
  iconBox: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: 'rgba(73, 192, 248, 0.1)',
    border: '1px solid rgba(73, 192, 248, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.15rem',
  },
  headerSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '0.35rem',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  errorBox: {
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: 'var(--accent-danger)',
    fontSize: '0.85rem',
  },
  footerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  loadingContainer: {
    padding: '2.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  spinnerOuter: {
    position: 'relative',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  spinnerRing: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: 'var(--accent-primary)',
    animation: 'spin 0.9s linear infinite',
  },
  loadingTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.4rem',
  },
  loadingSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  previewBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    color: 'var(--accent-success)',
    fontSize: '0.85rem',
  },
  previewHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  coursePreviewTitle: {
    fontSize: '1.25rem',
    lineHeight: '1.3',
  },
  coursePreviewDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.45',
    margin: 0,
  },
  chapterList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  chapterListTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: 600,
  },
  chapterCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.85rem 1rem',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--glass-border)',
  },
  chapterIndex: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: 'rgba(73, 192, 248, 0.1)',
    border: '1px solid rgba(73, 192, 248, 0.2)',
    color: 'var(--accent-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  chapterTitleText: {
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '0.15rem',
  },
  chapterSummaryText: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export default AICourseGenerator;
