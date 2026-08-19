import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import type { Course } from '../types';
import { GlassCard } from '../components/GlassCard';
import { Plus, Trash2, Edit2, Check, X, FileText, Sparkles } from 'lucide-react';
import { AICourseGenerator } from './AICourseGenerator';

export const CourseManager: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useAppState();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Bases de données');
  const [difficulty, setDifficulty] = useState<'Débutant' | 'Intermédiaire' | 'Avancé'>('Débutant');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newCourse: Course = {
      id: 'c_' + Date.now(),
      title,
      description,
      category,
      difficulty,
      xpReward: difficulty === 'Débutant' ? 300 : difficulty === 'Intermédiaire' ? 400 : 500,
      chapters: [
        {
          id: 'ch_mock_' + Date.now(),
          courseId: 'c_' + Date.now(),
          title: 'Chapitre 1 : Introduction',
          content: 'Ceci est un contenu de cours généré automatiquement par défaut pour les nouveaux cours.',
          summaryByAI: 'Introduction globale aux notions.',
          order: 1,
        },
      ],
    };

    addCourse(newCourse);
    resetForm();
  };

  const handleEditClick = (course: Course) => {
    setEditingId(course.id);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category);
    setDifficulty(course.difficulty);
  };

  const handleUpdate = (id: string) => {
    const original = courses.find((c) => c.id === id);
    if (!original || !title || !description) return;

    const updated: Course = {
      ...original,
      title,
      description,
      category,
      difficulty,
    };

    updateCourse(updated);
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Bases de données');
    setDifficulty('Débutant');
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Gestion des Cours</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Ajoutez, éditez et supprimez des cours ou chapitres pour le catalogue étudiant.
          </p>
        </div>
        {!isAdding && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setIsAIOpen(true)}
              className="btn btn-secondary"
              style={styles.aiBtn}
            >
              <Sparkles size={16} style={{ color: '#a78bfa' }} />
              <span>Générer avec l'IA</span>
            </button>
            <button onClick={() => setIsAdding(true)} className="btn btn-primary">
              <Plus size={16} />
              <span>Ajouter un cours</span>
            </button>
          </div>
        )}
      </div>

      {isAIOpen && <AICourseGenerator onClose={() => setIsAIOpen(false)} />}

      {/* Add Form */}
      {isAdding && (
        <GlassCard style={{ marginBottom: '2rem' }}>
          <div className="flex-between mb-1" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Ajouter un nouveau cours</h3>
            <button onClick={resetForm} style={styles.closeBtn}><X size={16} /></button>
          </div>
          
          <form onSubmit={handleCreate} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Titre du cours</label>
              <input
                type="text"
                placeholder="Ex: Architecture logicielle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                  style={{ background: 'rgba(15,23,42,0.8)' }}
                >
                  <option value="Bases de données">Bases de données</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Intelligence Artificielle">Intelligence Artificielle</option>
                  <option value="Systèmes">Systèmes & Réseaux</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulté</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="form-input"
                  style={{ background: 'rgba(15,23,42,0.8)' }}
                >
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description du syllabus</label>
              <textarea
                placeholder="Description du parcours..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                style={{ minHeight: '80px', resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Créer le cours
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Courses List */}
      <div style={styles.listContainer}>
        {courses.map((course) => {
          const isEditing = editingId === course.id;

          return (
            <GlassCard key={course.id} style={styles.courseItem}>
              {isEditing ? (
                /* EDITING VIEW */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                    style={{ fontWeight: 'bold' }}
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-input"
                    style={{ minHeight: '60px' }}
                  />
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="form-input"
                      style={{ background: 'rgba(15,23,42,0.8)' }}
                    >
                      <option value="Bases de données">Bases de données</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Intelligence Artificielle">Intelligence Artificielle</option>
                    </select>

                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="form-input"
                      style={{ background: 'rgba(15,23,42,0.8)' }}
                    >
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button onClick={() => setEditingId(null)} className="btn btn-secondary" style={styles.editBtn}>
                      <X size={14} />
                    </button>
                    <button onClick={() => handleUpdate(course.id)} className="btn btn-accent" style={styles.editBtn}>
                      <Check size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                /* STANDARD VIEW */
                <>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {course.category}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>•</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                        {course.difficulty}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{course.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {course.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <FileText size={12} />
                      <span>{course.chapters.length} chapitres configurés</span>
                    </div>
                  </div>

                  <div style={styles.actions}>
                    <button
                      onClick={() => handleEditClick(course)}
                      className="btn btn-secondary"
                      style={styles.iconBtn}
                      title="Éditer le cours"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="btn btn-danger"
                      style={styles.iconBtn}
                      title="Supprimer le cours"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  courseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1.5rem',
    padding: '1.25rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  iconBtn: {
    padding: '0.45rem',
  },
  editBtn: {
    padding: '0.4rem 0.8rem',
  },
  aiBtn: {
    border: '1px solid rgba(167,139,250,0.35)',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(167,139,250,0.1))',
  },
};

export default CourseManager;
