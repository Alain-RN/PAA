import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label affiché au-dessus du champ */
  label?: string;
  /** Icône à gauche */
  iconLeft?: React.ReactNode;
  /** Icône à droite */
  iconRight?: React.ReactNode;
  /** Message d'erreur affiché sous le champ */
  error?: string;
  /** Wrapper className */
  wrapperClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  iconLeft,
  iconRight,
  error,
  wrapperClassName = '',
  className = '',
  id,
  ...props
}) => {
  const fieldClasses = [
    'input-field',
    iconLeft ? 'has-icon-left' : '',
    iconRight ? 'has-icon-right' : '',
    error ? 'input-error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`input-wrapper ${wrapperClassName}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <div className="input-field-wrapper">
        {iconLeft && (
          <span className="input-icon-left" aria-hidden="true">
            {iconLeft}
          </span>
        )}
        <input id={id} className={fieldClasses} {...props} />
        {iconRight && (
          <span className="input-icon-right" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};

export default Input;
