import React from 'react';
import { useAppState } from '../../../hooks/useAppState';
import { Flame, Heart, Gem, GraduationCap } from 'lucide-react';
import './MobileHeader.css';

export const MobileHeader: React.FC = () => {
  const { currentUser } = useAppState();

  if (!currentUser) return null;

  const isStreakActive = currentUser.streak > 0;

  return (
    <header className="mobile-header">
      <div className="mobile-header-stats">
        {/* Level / Course Pill */}
        <div className="stat-pill level-pill" title={`Niveau ${currentUser.level}`}>
          <div className="level-icon-badge">
            <GraduationCap size={16} color="#ffffff" />
          </div>
          <span className="stat-pill-val level-val">{currentUser.level}</span>
        </div>

        {/* Streak Pill */}
        <div
          className={`stat-pill streak-pill ${isStreakActive ? 'active' : 'inactive'}`}
          title="Série de jours consécutifs"
        >
          <Flame
            size={18}
            color={isStreakActive ? '#ff9600' : '#52656d'}
            fill={isStreakActive ? '#ff9600' : 'none'}
          />
          <span className="stat-pill-val streak-val">{currentUser.streak}</span>
        </div>

        {/* Gems / XP Pill */}
        <div className="stat-pill gems-pill" title="Points XP & Gemmes">
          <Gem size={18} color="#1cb0f6" fill="#1cb0f6" />
          <span className="stat-pill-val gems-val">{currentUser.xp}</span>
        </div>

        {/* Hearts Pill */}
        <div className="stat-pill hearts-pill" title="Vies restantes">
          <Heart size={18} color="#ff4b4b" fill="#ff4b4b" />
          <span className="stat-pill-val hearts-val">5</span>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
