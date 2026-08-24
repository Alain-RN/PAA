import React from 'react';
import { Button } from '../ui';
import { Check, HelpCircle } from 'lucide-react';

interface LessonActionsBarProps {
  isCompleted: boolean;
  onCompleteChapter: () => void;
  onStartQuiz: () => void;
}

export const LessonActionsBar: React.FC<LessonActionsBarProps> = ({
  isCompleted,
  onCompleteChapter,
  onStartQuiz,
}) => {
  return (
    <div className="lesson-actions-bar">
      {isCompleted ? (
        <div className="lesson-completed-badge">
          <Check size={18} /> Chapitre terminé (+30 XP)
        </div>
      ) : (
        <Button
          variant="accent"
          onClick={onCompleteChapter}
          iconLeft={<Check size={18} />}
        >
          Valider la lecture (+30 XP)
        </Button>
      )}
      <Button
        variant="primary"
        onClick={onStartQuiz}
        iconLeft={<HelpCircle size={18} />}
      >
        Quiz d'adaptation
      </Button>
    </div>
  );
};
