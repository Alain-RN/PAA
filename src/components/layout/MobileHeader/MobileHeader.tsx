import React from 'react';
import { useAppState } from '../../../hooks/useAppState';
import { Flame, Heart, Sparkles, Gem } from 'lucide-react';
import './MobileHeader.css';

export const MobileHeader: React.FC = () => {
  const { currentUser } = useAppState();

  if (!currentUser) return null;

  const completedCount = currentUser.completedChapters.length;
  const estimatedXp = completedCount * 30 + currentUser.badges.length * 50;

  return (
    <header className="mobile-header">
      <div className="mobile-header-stats">
        {/* IA */}
        <div className="stat-pill" title="Assistant IA Adaptatif">
          <Sparkles size={16} color="var(--accent-secondary)" />
          <span className="stat-pill-val">IA</span>
        </div>

        {/* Streak */}
        <div className="stat-pill" title="Série de jours consécutifs">
          <Flame
            size={18}
            color="var(--accent-warning)"
            fill={currentUser.streak > 0 ? 'var(--accent-warning)' : 'none'}
          />
          <span className="stat-pill-val">{currentUser.streak}</span>
        </div>

        {/* XP */}
        <div className="stat-pill" title="Points XP accumulés">
          <Gem size={18} color="var(--accent-primary)" fill="rgba(73, 192, 248, 0.2)" />
          <span className="stat-pill-val" style={{ color: 'var(--accent-primary)' }}>
            {estimatedXp}
          </span>
        </div>

        {/* Hearts */}
        <div className="stat-pill" title="Vies restantes pour les quiz">
          <Heart size={18} color="var(--accent-danger)" fill="var(--accent-danger)" />
          <span className="stat-pill-val" style={{ color: 'var(--accent-danger)' }}>
            5
          </span>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
