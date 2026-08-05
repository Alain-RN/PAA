import React from 'react';
import './RightSidebar.css';
import { useAppState } from '../../../hooks/useAppState';
import { Flame, Shield, Heart, Zap, Lock, Gift, ChevronRight, Sparkles, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RightSidebar: React.FC = () => {
  const { currentUser, courses } = useAppState();
  const navigate = useNavigate();

  if (!currentUser) return null;

  // Calculs d'avancement
  const completedCount = currentUser.completedChapters.length;
  const estimatedXp = completedCount * 30 + currentUser.badges.length * 50;

  // Quête quotidienne (ex: 50 XP cible)
  const dailyTargetXp = 50;
  const dailyCurrentXp = Math.min(estimatedXp, dailyTargetXp);
  const questProgressPct = Math.round((dailyCurrentXp / dailyTargetXp) * 100);

  return (
    <aside className="right-sidebar">
      {/* ── 1. HEADER STATS EN LIGNE ── */}
      <div className="top-stats-row">
        {/* Widget IA Ollama / Statut */}
        <div className="top-stat-item ai-status-item" title="Assistant IA Adaptatif (Ollama local)">
          <Sparkles size={16} color="var(--accent-secondary)" />
          <span className="font-heading top-stat-val ai-tag">IA</span>
        </div>

        {/* Streak */}
        <div className="top-stat-item" title="Série de jours consécutifs">
          <Flame size={20} color="var(--accent-warning)" fill={currentUser.streak > 0 ? 'var(--accent-warning)' : 'none'} />
          <span className="streak-count top-stat-val">{currentUser.streak}</span>
        </div>

        {/* Gemmes / XP */}
        <div className="top-stat-item" title="Points XP accumulés">
          <div className="gem-icon">💎</div>
          <span className="font-xp top-stat-val" style={{ color: 'var(--accent-primary)' }}>
            {estimatedXp}
          </span>
        </div>

        {/* Vies / Coeurs */}
        <div className="top-stat-item" title="Vies restantes pour les quiz">
          <Heart size={20} color="#ef4444" fill="#ef4444" />
          <span className="font-xp top-stat-val" style={{ color: '#ef4444' }}>
            5
          </span>
        </div>
      </div>

      {/* ── 2. CARTE ASSISTANT IA & RECOMMANDEUR ── */}
      <div className="duo-card ai-recommendation-card" onClick={() => navigate('/catalog')}>
        <div className="duo-card-header-row">
          <h4 className="font-heading duo-card-title flex-align-gap">
            <Brain size={18} color="var(--accent-secondary)" /> Recommandation IA
          </h4>
        </div>
        <div className="duo-card-content">
          <p className="font-body duo-card-text">
            {completedCount === 0
              ? "L'IA conseille d'initier le chapitre 'Introduction aux SGBDR' pour démarrer votre courbe d'apprentissage."
              : `Progression globale à ${Math.round((completedCount / 3) * 100)}%. Générez votre prochain quiz adaptatif !`}
          </p>
        </div>
      </div>

      {/* ── 3. CARTE COMPÉTITION / LIGUES ── */}
      <div className="duo-card league-card" onClick={() => navigate('/leaderboard')}>
        <h4 className="font-heading duo-card-title">Débloque les Ligues !</h4>
        <div className="duo-card-content">
          <div className="shield-lock-wrapper">
            <Shield size={36} color="#94a3b8" />
            <Lock size={14} color="#fff" className="shield-lock-icon" />
          </div>
          <p className="font-body duo-card-text">
            {completedCount >= 2
              ? 'Ligue Bronze débloquée ! Consulte le classement.'
              : `Termine encore ${Math.max(0, 2 - completedCount)} leçon(s) pour rejoindre la compétition.`}
          </p>
        </div>
      </div>

      {/* ── 4. CARTE QUÊTES DU JOUR ── */}
      <div className="duo-card quest-card">
        <div className="duo-card-header-row">
          <h4 className="font-heading duo-card-title">Quêtes du jour</h4>
          <button className="link-action-btn" onClick={() => navigate('/profile')}>
            AFFICHER TOUT
          </button>
        </div>

        <div className="quest-item">
          <div className="quest-icon">
            <Zap size={26} color="#f59e0b" fill="#f59e0b" />
          </div>
          <div className="quest-details">
            <div className="quest-title font-heading">Gagne 50 XP aujourd'hui</div>
            <div className="quest-bar-container">
              <div className="quest-bar-track">
                <div
                  className="quest-bar-fill"
                  style={{ width: `${questProgressPct}%` }}
                />
              </div>
              <span className="quest-bar-text font-xp">{dailyCurrentXp} / {dailyTargetXp}</span>
              <div className="chest-icon" title="Coffre récompensant la quête">
                <Gift size={18} color="#d97706" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. ACTION NAVIGATION ── */}
      <div className="profile-buttons-col">
        <button
          className="duo-btn duo-btn-blue"
          onClick={() => navigate('/catalog')}
        >
          CONTINUER LE COURS <ChevronRight size={18} />
        </button>
      </div>
    </aside>
  );
};

export default RightSidebar;
