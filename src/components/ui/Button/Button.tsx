import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Style visuel du bouton */
  variant?: ButtonVariant;
  /** Taille du bouton */
  size?: ButtonSize;
  /** Icône à gauche du texte */
  iconLeft?: React.ReactNode;
  /** Icône à droite du texte */
  iconRight?: React.ReactNode;
  /** Affiche un spinner et désactive le bouton */
  loading?: boolean;
  /** Prend toute la largeur disponible */
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : (
        iconLeft && <span className="btn-icon-left">{iconLeft}</span>
      )}
      {children}
      {!loading && iconRight && (
        <span className="btn-icon-right">{iconRight}</span>
      )}
    </button>
  );
};

export default Button;
