import React from 'react';
import './Badge.css';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral';

export interface BadgeProps {
  /** Style visuel du badge */
  variant?: BadgeVariant;
  /** Grande taille */
  large?: boolean;
  /** Icône affichée avant le texte */
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  large = false,
  icon,
  children,
  className = '',
  style,
}) => {
  const classes = [
    'badge',
    `badge-${variant}`,
    large ? 'badge-lg' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} style={style}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
