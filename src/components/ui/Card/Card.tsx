import React from 'react';
import './Card.css';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Active l'effet hover de translation */
  interactive?: boolean;
  /** Contrôle le padding interne */
  padding?: CardPadding;
  /** Ajoute une bordure lumineuse primaire */
  glow?: boolean;
  /** Ajoute une bordure lumineuse succès */
  glowSuccess?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  padding = 'md',
  glow = false,
  glowSuccess = false,
  className = '',
  ...props
}) => {
  const classes = [
    'card',
    `card-padding-${padding}`,
    interactive ? 'card-interactive' : '',
    glow ? 'card-glow' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
