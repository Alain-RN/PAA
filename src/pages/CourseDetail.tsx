import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppState } from '../hooks/useAppState';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  Sparkles,
  Gift,
  Brain,
  List,
  X,
  Gem,
  Compass,
  ChevronsRight,
  Star,
} from 'lucide-react';
import { Button, ProgressBar } from '../components/ui';
import './CourseDetail.css';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentUser, courses } = useAppState();

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);

  if (!currentUser) return null;

  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return (
      <div className="course-detail-container">
        <h2>Cours introuvable</h2>
        <Button variant="secondary" onClick={() => navigate('/catalog')}>
          Retour au catalogue
        </Button>
      </div>
    );
  }

  const completedCount = course.chapters.filter((ch) =>
    currentUser.completedChapters.includes(ch.id)
  ).length;
  const progressPct = Math.round((completedCount / (course.chapters.length || 1)) * 100);

  // ── Mathematically Uniform Zig-Zag Path (Constant 128px Step Distance) ──
  const count = course.chapters.length;
  const getNodeX = (i: number) => {
    const rem = i % 4;
    if (rem === 0 || rem === 2) return 170; // Centre
    if (rem === 1) return 250;              // Droite (+80px)
    return 90;                              // Gauche (-80px)
  };
  const getNodeY = (i: number) => i * 100 + 65;
  const totalCanvasHeight = (count + 1) * 100 + 40;

  // Alternate icons for future locked steps (Book, Star, Brain, etc. like Duolingo)
  const getLockedIcon = (idx: number) => {
    const icons = [
      <BookOpen size={30} color="#52656d" key={idx} />,
      <Star size={30} color="#52656d" key={idx} />,
      <Brain size={30} color="#52656d" key={idx} />,
    ];
    return icons[idx % icons.length];
  };

  return (
    <div className="course-detail-container">
      {/* Bouton Retour */}
      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/catalog')}
          iconLeft={<ArrowLeft size={16} />}
        >
          Retour au catalogue
        </Button>
      </div>

      {/* En-tête du Cours */}
      <div className="course-detail-header">
        <div className="course-header-top">
          <span className="course-category-badge">{course.category}</span>

          {/* Basculer entre Vue Carte et Vue Liste */}
          <div className="view-toggle-btns">
            <button
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <Compass size={15} />
              <span>Carte</span>
            </button>
            <button
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={15} />
              <span>Syllabus</span>
            </button>
          </div>
        </div>

        <h1 className="course-title">{course.title}</h1>
        <p className="course-description">{course.description}</p>

        <div className="course-stats-bar">
          <div style={{ flex: 1, maxWidth: '300px' }}>
            <ProgressBar progress={progressPct} showPercentage color="success" />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9ca3af' }}>
            {completedCount} / {course.chapters.length} chapitres maîtrisés
          </span>
        </div>
      </div>

      {/* ── MODE 1 : VUE CARTE EXACTE DUOLINGO ── */}
      {viewMode === 'map' ? (
        <div className="adventure-map-wrapper">
          <div className="map-trail-canvas" style={{ height: `${totalCanvasHeight}px` }}>
            {/* Nœuds des Chapitres */}
            {course.chapters.map((chapter, idx) => {
              const isCompleted = currentUser.completedChapters.includes(chapter.id);
              const isActive =
                !isCompleted &&
                (idx === 0 || currentUser.completedChapters.includes(course.chapters[idx - 1].id));
              const x = getNodeX(idx);
              const y = getNodeY(idx);

              return (
                <div key={chapter.id} className="duo-node-item" style={{ left: `${x}px`, top: `${y}px` }}>
                  {/* Bulle de dialogue flottante exacte ("AVANCER ICI ?") sur le nœud actif */}
                  {isActive && (
                    <div className="duo-speech-tooltip">
                      <span>AVANCER ICI ?</span>
                    </div>
                  )}

                  {/* Bouton Nœud 3D Duolingo */}
                  <button
                    className={`duo-node-btn ${
                      isCompleted ? 'completed' : isActive ? 'active' : 'locked'
                    }`}
                    onClick={() => setSelectedChapter(chapter)}
                    title={chapter.title}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={36} color="#ffffff" />
                    ) : isActive ? (
                      <ChevronsRight size={36} color="#ffffff" />
                    ) : (
                      getLockedIcon(idx)
                    )}
                  </button>
                </div>
              );
            })}

            {/* Nœud Coffre de Fin */}
            <div
              className="duo-node-item"
              style={{ left: `${getNodeX(count)}px`, top: `${getNodeY(count)}px` }}
            >
              <button
                className="duo-node-btn checkpoint"
                onClick={() =>
                  alert("🎉 Félicitations ! Complétez tous les chapitres pour ouvrir ce coffre (+100 XP) !")
                }
              >
                <Gift size={36} color="#52656d" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── MODE 2 : VUE LISTE / SYLLABUS ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {course.chapters.map((chapter, idx) => {
            const isCompleted = currentUser.completedChapters.includes(chapter.id);
            const isWeak = currentUser.weakChapters.includes(chapter.id);

            return (
              <GlassCard
                key={chapter.id}
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderColor: isWeak ? 'rgba(239, 68, 68, 0.4)' : '#2b3940',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      background: isCompleted ? '#58cc02' : '#233138',
                      color: isCompleted ? '#ffffff' : '#9ca3af',
                      border: '1px solid #2b3940',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                        {chapter.title}
                      </h3>
                      {isWeak && (
                        <span
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.4rem',
                            borderRadius: '4px',
                          }}
                        >
                          À réviser (IA)
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: '#9ca3af',
                        marginTop: '0.35rem',
                        lineHeight: 1.45,
                      }}
                    >
                      {chapter.summaryByAI.substring(0, 120)}...
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'flex-end',
                    borderTop: '1px solid #2b3940',
                    paddingTop: '0.75rem',
                  }}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/lesson/${course.id}/${chapter.id}`)}
                    iconLeft={<BookOpen size={15} />}
                  >
                    Lire le cours
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/quiz/${course.id}/${chapter.id}`)}
                    iconLeft={<HelpCircle size={15} />}
                  >
                    Quiz adaptatif
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* ── 📖 MODAL POP-UP STYLE DUOLINGO (PORTAL) ── */}
      {selectedChapter &&
        createPortal(
          <div className="duo-modal-overlay" onClick={() => setSelectedChapter(null)}>
            <div className="duo-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="duo-modal-top-bar">
                <div className="duo-modal-header-badge">
                  <Sparkles size={14} />
                  <span>
                    Étape {course.chapters.findIndex((c) => c.id === selectedChapter.id) + 1} sur{' '}
                    {course.chapters.length}
                  </span>
                </div>
                <button className="duo-modal-close" onClick={() => setSelectedChapter(null)}>
                  <X size={16} />
                </button>
              </div>

              <h3 className="duo-modal-title">{selectedChapter.title}</h3>

              <div className="duo-modal-summary-box">{selectedChapter.summaryByAI}</div>

              <div className="duo-modal-reward">
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                  Récompense du chapitre
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    color: '#ffc800',
                  }}
                >
                  <Gem size={18} color="#ffc800" fill="#ffc800" /> +30 XP
                </span>
              </div>

              {currentUser.weakChapters.includes(selectedChapter.id) && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8rem',
                    color: '#ef4444',
                    fontWeight: 700,
                  }}
                >
                  <Brain size={16} />
                  <span>Recommandé par l'IA pour corriger vos lacunes.</span>
                </div>
              )}

              <div className="duo-modal-actions">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate(`/lesson/${course.id}/${selectedChapter.id}`)}
                  iconLeft={<BookOpen size={16} />}
                  style={{
                    background: '#ce82ff',
                    borderColor: '#9333ea',
                    boxShadow: '0 4px 0 #9333ea',
                  }}
                >
                  Commencer la leçon (+30 XP)
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate(`/quiz/${course.id}/${selectedChapter.id}`)}
                  iconLeft={<HelpCircle size={16} />}
                >
                  Quiz adaptatif
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default CourseDetail;
