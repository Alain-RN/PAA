import React from 'react';
import './ProgressBar.css';

export type ProgressBarSize = 'sm' | 'md' | 'lg';
export type ProgressBarColor = 'primary' | 'success' | 'warning' | 'danger';

export interface ProgressBarProps {
  /** Valeur entre 0 et 100 */
  progress: number;
  /** Label affiché à gauche */
  label?: string;
  /** Affiche le pourcentage à droite */
  showPercentage?: boolean;
  /** Hauteur de la barre */
  size?: ProgressBarSize;
  /** Couleur de la barre */
  color?: ProgressBarColor;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = false,
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round(progress)));

  const fillClass = [
    'progress-fill',
    color !== 'primary' ? `progress-fill-${color}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`progress-wrapper ${className}`}>
      {(label || showPercentage) && (
        <div className="progress-header">
          {label && <span className="progress-label">{label}</span>}
          {showPercentage && (
            <span className="progress-percent">{percentage}%</span>
          )}
        </div>
      )}
      <div
        className={`progress-track progress-track-${size}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={fillClass} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
