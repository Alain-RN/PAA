import React from 'react';
import { Button } from '../ui';
import { ArrowLeft, Edit3, Save, X, BookOpen } from 'lucide-react';

interface LessonHeaderProps {
  courseTitle: string;
  chapterIdx: number;
  chapterTitle: string;
  isEditing: boolean;
  isSaving: boolean;
  editChapterTitle: string;
  onNavigateBack: () => void;
  onStartEditing: () => void;
  onCancel: () => void;
  onSave: () => void;
  onEditChapterTitleChange: (val: string) => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  courseTitle,
  chapterIdx,
  chapterTitle,
  isEditing,
  isSaving,
  editChapterTitle,
  onNavigateBack,
  onStartEditing,
  onCancel,
  onSave,
  onEditChapterTitleChange,
}) => {
  return (
    <>
      {/* ── BARRE TOP (STICKY / FIXÉE AU TOUT HAUT DE PAGE) ── */}
      <div className="lesson-topbar">
        { isEditing && <div style={{flex: 1}}/>}
        { !isEditing && <Button
          variant="secondary"
          size="sm"
          onClick={onNavigateBack}
          iconLeft={<ArrowLeft size={16} />}
        >
          Retour au cours
        </Button>}
        <div className="lesson-tools">
          {!isEditing ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={onStartEditing}
              iconLeft={<Edit3 size={15} />}
            >
              Éditer le chapitre
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={onCancel}
                iconLeft={<X size={15} />}
              >
                Annuler
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={onSave}
                loading={isSaving}
                iconLeft={<Save size={15} />}
              >
                Enregistrer
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ── EN-TÊTE DU CHAPITRE ── */}
      <div className="lesson-header">
        <span className="lesson-chapter-num">
          <BookOpen size={14} color="#ce82ff" /> {courseTitle} — Chapitre {chapterIdx + 1}
        </span>
        {isEditing ? (
          <div>
            <label
              style={{
                fontSize: '0.78rem',
                color: '#ce82ff',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Modifier le titre du chapitre
            </label>
            <input
              type="text"
              className="lesson-title-input"
              value={editChapterTitle}
              onChange={(e) => onEditChapterTitleChange(e.target.value)}
              placeholder="Titre du chapitre..."
            />
          </div>
        ) : (
          <h1 className="lesson-title">{chapterTitle}</h1>
        )}
      </div>
    </>
  );
};
