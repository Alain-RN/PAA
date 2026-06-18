import React from 'react';
import './PageHeader.css';

export interface PageHeaderProps {
  /** Titre principal de la page (h1) */
  title: string;
  /** Sous-titre ou description */
  subtitle?: string;
  /** Contenu optionnel à droite (bouton d'action, badge…) */
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <header className={`page-header ${className}`}>
      <div className="page-header-content">
        <h1 className="page-header-title">{title}</h1>
        {subtitle && (
          <p className="page-header-subtitle">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="page-header-action">{action}</div>
      )}
    </header>
  );
};

export default PageHeader;
