import React, { useState } from "react";
import { useAppState } from "../hooks/useAppState";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../components/ProgressBar";
import { Button } from "../components/ui/Button";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Wand2,
  BookOpen,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import { generateCourseWithAI } from "../services/aiService";

const inferCategoryFromTopic = (topic: string): string => {
  const t = topic.toLowerCase();
  if (
    t.includes("anglais") ||
    t.includes("espagnol") ||
    t.includes("allemand") ||
    t.includes("italien") ||
    t.includes("langue") ||
    t.includes("japonais") ||
    t.includes("chinois") ||
    t.includes("français") ||
    t.includes("vocabulaire") ||
    t.includes("grammaire")
  ) {
    return "Langues";
  }
  if (
    t.includes("histoire") ||
    t.includes("géographie") ||
    t.includes("culture") ||
    t.includes("art") ||
    t.includes("philo") ||
    t.includes("droit")
  ) {
    return "Culture & Histoire";
  }
  if (
    t.includes("math") ||
    t.includes("physique") ||
    t.includes("chimie") ||
    t.includes("biologie") ||
    t.includes("science")
  ) {
    return "Sciences";
  }
  if (
    t.includes("marketing") ||
    t.includes("business") ||
    t.includes("finance") ||
    t.includes("management") ||
    t.includes("économie")
  ) {
    return "Business & Management";
  }
  return "Informatique";
};

export const CourseCatalog: React.FC = () => {
  const { currentUser, courses, addCourse, deleteCourse, addQuestionsForChapter } =
    useAppState();
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!currentUser) return null;

  const handleDeleteCourse = (e: React.MouseEvent, courseId: string, courseTitle: string) => {
    e.stopPropagation();
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le cours "${courseTitle}" ?`)) {
      deleteCourse(courseId);
    }
  };

  const handleGenerateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isGenerating) return;

    setIsGenerating(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const inferredCategory = inferCategoryFromTopic(topic.trim());

    try {
      const result = await generateCourseWithAI({
        title: topic.trim(),
        category: inferredCategory,
        difficulty: "Débutant",
        nbChapters: 3,
      });

      addCourse(result.course);
      Object.entries(result.questionsByChapter).forEach(
        ([chapterId, questions]) => {
          addQuestionsForChapter(chapterId, questions);
        },
      );

      setSuccessMessage(
        `Félicitations ! Le cours "${result.course.title}" et ses chapitres ont été générés par l'IA localement (anciens cours supprimés).`,
      );
      setTopic("");
    } catch {
      setErrorMessage(
        "Une erreur est survenue lors de la génération. Veuillez réessayer.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* ── Page Header with Action Button ── */}
      <div style={styles.headerRow}>
        <div>
          <h1 className="font-heading" style={{ fontSize: "2.1rem", margin: 0, fontWeight: 800 }}>
            Catalogue de Cours
          </h1>
          <p
            className="font-body"
            style={{ color: "var(--text-secondary)", margin: "0.3rem 0 0 0" }}
          >
            🚀 Spécialisé <strong style={{ color: 'var(--accent-primary)' }}>Tech & Code</strong> — mais capable d'enseigner n'importe quel sujet.
          </p>
        </div>

        <Button
          style={{ marginTop: "1rem" }}
          variant="primary"
          size="md"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          iconLeft={isFormOpen ? <X size={18} /> : <Plus size={18} />}
        >
          {isFormOpen ? "Masquer la création" : "Créer un cours avec l'IA"}
        </Button>
      </div>

      {/* ── Course Creation Section (Toggled by Button) ── */}
      {isFormOpen && (
        <div style={styles.createBoxContainer}>
          <div style={styles.createHeader}>
            <Wand2 size={24} color="var(--accent-primary)" />
            <span style={styles.createTitle}>
              Créer un nouveau cours personnalisé avec l'IA
            </span>
          </div>

          <form onSubmit={handleGenerateCourse} style={styles.createForm}>
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
                💡 Domaines recommandés (spécialité Tech)
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {['TypeScript', 'Python', 'SQL & PostgreSQL', 'Rust', 'React', 'Node.js / API', 'DevOps & Docker', 'Algorithmes'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTopic(tag)}
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '8px',
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.28)',
                      color: 'var(--accent-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                Autres sujets supportés
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {['Cuisine & Gastronomie', 'Anglais conversationnel', 'Mathématiques', 'Mécanique automobile'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTopic(tag)}
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '8px',
                      background: 'rgba(148, 163, 184, 0.08)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              style={styles.courseTextarea}
              rows={3}
              placeholder="Ex: TypeScript avancé, SQL & PostgreSQL, Python pour Data Science, Rust..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
            />

            <div style={styles.buttonRow}>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isGenerating || !topic.trim()}
                loading={isGenerating}
                iconLeft={!isGenerating ? <Sparkles size={15} /> : undefined}
              >
                GÉNÉRER LE COURS
              </Button>
            </div>
          </form>

          {/* Feedback Messages */}
          {successMessage && (
            <div style={styles.successBanner}>
              <CheckCircle2 size={18} color="var(--accent-success)" />
              <span style={{ fontWeight: 700 }}>{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div style={styles.errorBanner}>
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* ── Course Cards Grid / Empty State ── */}
      {courses.length === 0 ? (
        <div style={styles.emptyContainer}>
          <BookOpen size={48} color="var(--accent-primary)" style={{ opacity: 0.7 }} />
          <h3 className="font-heading" style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0.8rem 0 0.4rem 0" }}>
            Aucun cours disponible en base de données PostgreSQL
          </h3>
          <p className="font-body" style={{ color: "var(--text-secondary)", maxWidth: "460px", textAlign: "center", margin: "0 0 1.2rem 0", lineHeight: 1.5 }}>
            Votre catalogue est actuellement vide. Utilisez le bouton <strong>"Créer un cours avec l'IA"</strong> ci-dessus pour générer dynamiquement votre premier parcours de formation !
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setIsFormOpen(true);
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
            iconLeft={<Wand2 size={16} />}
          >
            Créer mon premier cours
          </Button>
        </div>
      ) : (
        <div style={styles.grid}>
          {courses.map((course) => {
            const courseChapterIds = course.chapters.map((ch) => ch.id);
            const completedCount = courseChapterIds.filter((id) =>
              currentUser.completedChapters.includes(id),
            ).length;
            const progress = Math.round(
              (completedCount / courseChapterIds.length) * 100,
            );
            const isCompleted = progress === 100;

            return (
              <div key={course.id} style={styles.duoCard}>
                {/* Upper Section */}
                <div style={styles.cardUpper}>
                  {/* Top Row: Chapters count (Left) & XP Badge + Delete Action (Right) */}
                  <div style={styles.topMetaRow}>
                    <div style={styles.chaptersBadge}>
                      <BookOpen size={24} color="var(--accent-primary)" />
                      <span>{course.chapters.length} chapitres</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={styles.xpPill}>
                        <span>+ {course.xpReward} XP</span>
                      </div>

                      <button
                        onClick={(e) => handleDeleteCourse(e, course.id, course.title)}
                        title="Supprimer ce cours"
                        style={styles.deleteIconButton}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.25)";
                          e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.6)";
                          e.currentTarget.style.color = "#ef4444";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                          e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.25)";
                          e.currentTarget.style.color = "#f87171";
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading" style={styles.duoTitle}>
                    {course.title}
                  </h3>

                  {/* Clean Description */}
                  <p className="font-body" style={styles.duoDescription}>
                    {course.description}
                  </p>
                </div>

                {/* Lower Section */}
                <div style={styles.cardLower}>
                  {/* Progress Bar */}
                  <div style={styles.progressContainer}>
                    <ProgressBar progress={progress} showPercentage={false} />
                  </div>

                  {/* Duolingo 3D Full-Width Button */}
                  <Button
                    variant={isCompleted ? "accent" : "primary"}
                    fullWidth
                    size="sm"
                    onClick={() => navigate(`/course/${course.id}`)}
                    iconRight={<ArrowRight size={16} />}
                  >
                    {progress > 0
                      ? isCompleted
                        ? "REVOIR"
                        : "CONTINUER"
                      : "DÉMARRER"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "2.2rem",
  },
  /* ── Creation Container ── */
  createBoxContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.65rem",
    width: "100%",
  },
  createHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  createTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    fontFamily: "var(--font-heading)",
    letterSpacing: "0.02em",
  },
  createForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
    width: "100%",
  },
  courseTextarea: {
    width: "100%",
    minHeight: "150px",
    padding: "1rem 1.2rem",
    borderRadius: "16px",
    border: "2px solid var(--glass-border)",
    backgroundColor: "var(--bg-card)",
    color: "var(--text-secondary)",
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
    fontWeight: 600,
    lineHeight: "1.55",
    outline: "none",
    resize: "vertical",
    boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.4)",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
  },

  /* ── Feedback Banners ── */
  successBanner: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.85rem 1.1rem",
    borderRadius: "12px",
    backgroundColor: "rgba(16, 185, 129, 0.14)",
    border: "2px solid rgba(16, 185, 129, 0.35)",
    color: "var(--accent-success)",
    fontSize: "0.9rem",
  },
  errorBanner: {
    padding: "0.85rem 1.1rem",
    borderRadius: "12px",
    backgroundColor: "rgba(239, 68, 68, 0.14)",
    border: "2px solid rgba(239, 68, 68, 0.35)",
    color: "var(--accent-danger)",
    fontSize: "0.9rem",
  },

  /* ── Cards Grid ── */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.5rem",
    isolation: "isolate",
  },

  /* ── Course Cards ── */
  duoCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    padding: "1.4rem 1.4rem 1.8rem 1.4rem",
    borderRadius: "20px",
    border: "2px solid var(--glass-border)",
    boxShadow: "0 4px 0 var(--glass-border)",
    boxSizing: "border-box",
    overflow: "hidden",
    isolation: "isolate",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
  },
  cardUpper: {
    display: "flex",
    flexDirection: "column",
  },
  topMetaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.9rem",
  },
  chaptersBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "var(--text-primary)",
  },
  xpPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    fontSize: "0.85rem",
    fontWeight: 900,
    color: "#ffffff",
    backgroundColor: "#f59e0b",
    boxShadow: "0 3px 0 #b45309",
    padding: "0.25rem 0.65rem",
    borderRadius: "10px",
  },
  deleteIconButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    color: "#f87171",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    outline: "none",
  },

  duoTitle: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#ffffff",
    margin: "0 0 0.55rem 0",
    lineHeight: "1.35",
  },
  duoDescription: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardLower: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "0.8rem",
  },
  progressContainer: {
    width: "100%",
  },
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3.5rem 1.5rem",
    borderRadius: "24px",
    border: "2px dashed var(--glass-border)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    textAlign: "center",
  },
};

export default CourseCatalog;
