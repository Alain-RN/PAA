import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { GlassCard } from '../components/GlassCard';
import { Crown, Flame, Zap } from 'lucide-react';

/* ─── Medal config ─── */
const MEDALS = [
  {
    rank: 1,
    label: '🥇',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.35)',
    bg: 'linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.04) 100%)',
    border: 'rgba(251,191,36,0.45)',
    barColor: '#fbbf24',
    podiumHeight: 160,
  },
  {
    rank: 2,
    label: '🥈',
    color: '#94a3b8',
    glow: 'rgba(148,163,184,0.25)',
    bg: 'linear-gradient(135deg, rgba(148,163,184,0.12) 0%, rgba(148,163,184,0.02) 100%)',
    border: 'rgba(148,163,184,0.35)',
    barColor: '#94a3b8',
    podiumHeight: 110,
  },
  {
    rank: 3,
    label: '🥉',
    color: '#cd7c3f',
    glow: 'rgba(205,124,63,0.25)',
    bg: 'linear-gradient(135deg, rgba(205,124,63,0.12) 0%, rgba(205,124,63,0.02) 100%)',
    border: 'rgba(205,124,63,0.3)',
    barColor: '#cd7c3f',
    podiumHeight: 80,
  },
];

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const Leaderboard: React.FC = () => {
  const { leaderboard, currentUser } = useAppState();
  if (!currentUser) return null;

  const top3 = leaderboard.slice(0, 3);
  const rest  = leaderboard.slice(3);
  const maxXp  = leaderboard[0]?.xp || 1;

  /* podium order: 2 – 1 – 3 */
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div style={styles.page}>

      {/* ── HEADER ── */}
      <div style={styles.header}>
        <div>
          <h1 className="font-heading" style={styles.title}>
            <Crown size={28} color="#fbbf24" fill="#fbbf24" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Classement
          </h1>
          <p className="font-body" style={styles.subtitle}>
            Gagnez de l'XP en complétant des cours et des quiz adaptatifs pour grimper dans le classement.
          </p>
        </div>
        <div style={styles.myRankPill}>
          <Zap size={14} color="var(--accent-warning)" fill="var(--accent-warning)" />
          <span className="font-xp" style={{ color: 'var(--accent-warning)', fontSize: '0.9rem' }}>
            {leaderboard.find(e => e.name === currentUser.name)?.xp ?? 0} XP
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>· votre score</span>
        </div>
      </div>

      {/* ── PODIUM TOP 3 ── */}
      <div style={styles.podiumSection}>
        {podiumOrder.map((entry) => {
          if (!entry) return null;
          const medal = MEDALS.find(m => m.rank === entry.rank)!;
          const isFirst = entry.rank === 1;

          return (
            <div
              key={entry.rank}
              style={{
                ...styles.podiumSlot,
                order: entry.rank === 2 ? 0 : entry.rank === 1 ? 1 : 2,
                alignSelf: isFirst ? 'flex-end' : 'flex-end',
              }}
            >
              {/* Crown for #1 */}
              {isFirst && (
                <div style={styles.crownFloat}>
                  <Crown size={26} color="#fbbf24" fill="#fbbf24" />
                </div>
              )}

              {/* Card */}
              <div
                style={{
                  ...styles.podiumCard,
                  background: medal.bg,
                  border: `1.5px solid ${medal.border}`,
                  boxShadow: isFirst ? `0 0 32px ${medal.glow}` : `0 0 14px ${medal.glow}`,
                  transform: isFirst ? 'scale(1.06)' : 'scale(1)',
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    ...styles.avatar,
                    width: isFirst ? '64px' : '52px',
                    height: isFirst ? '64px' : '52px',
                    fontSize: isFirst ? '1.3rem' : '1rem',
                    border: `2.5px solid ${medal.color}`,
                    boxShadow: `0 0 16px ${medal.glow}`,
                  }}
                >
                  {initials(entry.name)}
                </div>

                {/* Medal emoji */}
                <div style={{ fontSize: isFirst ? '1.6rem' : '1.3rem', lineHeight: 1, marginTop: '-4px' }}>
                  {medal.label}
                </div>

                {/* Name */}
                <div
                  className="font-heading"
                  style={{
                    ...styles.podiumName,
                    color: medal.color,
                    fontSize: isFirst ? '0.95rem' : '0.85rem',
                  }}
                >
                  {entry.name.split(' ')[0]}
                </div>

                {/* XP */}
                <div className="font-xp" style={{ ...styles.podiumXp, color: medal.color }}>
                  {entry.xp.toLocaleString()} XP
                </div>

                {/* XP bar */}
                <div style={styles.barTrack}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${(entry.xp / maxXp) * 100}%`,
                      background: medal.barColor,
                      boxShadow: `0 0 8px ${medal.glow}`,
                    }}
                  />
                </div>
              </div>

              {/* Podium step */}
              <div
                style={{
                  ...styles.podiumStep,
                  height: `${medal.podiumHeight}px`,
                  background: medal.bg,
                  border: `1px solid ${medal.border}`,
                  borderBottom: 'none',
                }}
              >
                <span className="font-heading" style={{ color: medal.color, fontSize: '1.4rem', opacity: 0.6 }}>
                  {entry.rank}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LISTE ── */}
      <GlassCard style={styles.listCard}>
        {/* Header row */}
        <div style={styles.listHead}>
          <span style={{ flex: '0 0 48px', textAlign: 'center' }}>#</span>
          <span style={{ flex: 1 }}>Étudiant</span>
          <span style={{ flex: '0 0 80px', textAlign: 'center' }}>Badge</span>
          <span style={{ flex: '0 0 60px', textAlign: 'center' }}>Lvl</span>
          <span style={{ flex: '0 0 120px', textAlign: 'right' }}>Score XP</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '0 0 0.5rem' }} />

        {/* Top 3 rows */}
        {top3.map((entry) => {
          const isUser = entry.name === currentUser.name;
          const medal = MEDALS.find(m => m.rank === entry.rank)!;
          return (
            <LeaderRow
              key={entry.rank}
              entry={entry}
              isUser={isUser}
              maxXp={maxXp}
              accentColor={medal.color}
              accentGlow={medal.glow}
              barColor={medal.barColor}
              label={medal.label}
            />
          );
        })}

        {rest.length > 0 && (
          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '0.25rem 0' }} />
        )}

        {/* Rest */}
        {rest.map((entry) => {
          const isUser = entry.name === currentUser.name;
          return (
            <LeaderRow
              key={entry.rank}
              entry={entry}
              isUser={isUser}
              maxXp={maxXp}
              accentColor="var(--text-secondary)"
              accentGlow="transparent"
              barColor="var(--accent-primary)"
              label={`${entry.rank}`}
            />
          );
        })}
      </GlassCard>
    </div>
  );
};

/* ─── Composant ligne ─── */
interface LeaderEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  primaryBadge: string;
  isCurrentUser?: boolean;
}

interface LeaderRowProps {
  entry: LeaderEntry;
  isUser: boolean;
  maxXp: number;
  accentColor: string;
  accentGlow: string;
  barColor: string;
  label: string;
}

const LeaderRow: React.FC<LeaderRowProps> = ({
  entry, isUser, maxXp, accentColor, accentGlow, barColor, label,
}) => {
  const barPct = Math.round((entry.xp / maxXp) * 100);

  return (
    <div
      style={{
        ...rowStyles.row,
        background: isUser
          ? 'rgba(73,192,248,0.07)'
          : 'transparent',
        borderLeft: isUser
          ? '3px solid var(--accent-primary)'
          : '3px solid transparent',
      }}
    >
      {/* Rank */}
      <div style={{ flex: '0 0 48px', textAlign: 'center' }}>
        <span style={{ fontSize: entry.rank <= 3 ? '1.3rem' : '0.9rem', lineHeight: 1 }}>
          {label}
        </span>
      </div>

      {/* Avatar + name */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        <div
          style={{
            ...rowStyles.avatar,
            border: `2px solid ${isUser ? 'var(--accent-primary)' : accentColor}`,
            boxShadow: isUser ? `0 0 10px rgba(73,192,248,0.3)` : undefined,
          }}
        >
          {initials(entry.name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            className="font-heading"
            style={{
              fontSize: '0.9rem',
              fontWeight: isUser ? 700 : 600,
              color: isUser ? 'var(--accent-primary)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            {entry.name}
            {isUser && (
              <span style={rowStyles.youTag}>
                <Flame size={10} fill="currentColor" /> Vous
              </span>
            )}
          </div>
          {/* XP mini-bar */}
          <div style={rowStyles.miniBarTrack}>
            <div
              style={{
                ...rowStyles.miniBarFill,
                width: `${barPct}%`,
                background: isUser ? 'var(--accent-primary)' : barColor,
                boxShadow: isUser ? `0 0 6px rgba(73,192,248,0.5)` : `0 0 4px ${accentGlow}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Badge */}
      <div style={{ flex: '0 0 80px', textAlign: 'center', fontSize: '1.3rem' }}>
        {entry.primaryBadge}
      </div>

      {/* Level */}
      <div style={{ flex: '0 0 60px', textAlign: 'center' }}>
        <span style={rowStyles.lvlChip}>Lvl {entry.level}</span>
      </div>

      {/* XP */}
      <div style={{ flex: '0 0 120px', textAlign: 'right' }}>
        <span
          className="font-xp"
          style={{
            color: isUser ? 'var(--accent-primary)' : accentColor,
            fontSize: '0.95rem',
          }}
        >
          {entry.xp.toLocaleString()} XP
        </span>
      </div>
    </div>
  );
};

/* ─── Styles page ─── */
const styles: Record<string, React.CSSProperties> = {
  page: { width: '100%' },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.3rem',
    display: 'flex',
    alignItems: 'center',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    maxWidth: '480px',
  },
  myRankPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(245,158,11,0.1)',
    border: '1px solid rgba(245,158,11,0.3)',
    borderRadius: '999px',
    padding: '0.5rem 1rem',
    flexShrink: 0,
  },

  /* Podium */
  podiumSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: '1.25rem',
    marginBottom: '2.5rem',
    padding: '2.5rem 0 0',
  },
  podiumSlot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '180px',
    position: 'relative',
  },
  crownFloat: {
    position: 'absolute',
    top: '-38px',
    animation: 'bounce 2.5s ease-in-out infinite',
    filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.7))',
    zIndex: 2,
  },
  podiumCard: {
    width: '100%',
    borderRadius: '16px 16px 0 0',
    padding: '1.25rem 1rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.35rem',
    backdropFilter: 'blur(8px)',
    transition: 'transform 0.2s ease',
  },
  avatar: {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    color: '#fff',
    background: 'rgba(255,255,255,0.07)',
    flexShrink: 0,
  },
  podiumName: {
    fontWeight: 700,
    textAlign: 'center',
    marginTop: '0.1rem',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  podiumXp: {
    fontSize: '0.82rem',
    marginBottom: '0.4rem',
  },
  barTrack: {
    width: '100%',
    height: '4px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 1s ease',
  },
  podiumStep: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '0.6rem',
    backdropFilter: 'blur(4px)',
  },

  /* List */
  listCard: {
    padding: '1rem 1.25rem',
  },
  listHead: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    color: 'var(--text-muted)',
    padding: '0.25rem 0.5rem 0.75rem',
    gap: '0.5rem',
  },
};

/* ─── Styles lignes ─── */
const rowStyles: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 0.5rem',
    borderRadius: '10px',
    transition: 'background 0.2s ease',
    marginBottom: '2px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    flexShrink: 0,
  },
  miniBarTrack: {
    height: '3px',
    background: 'rgba(255,255,255,0.07)',
    borderRadius: '2px',
    marginTop: '4px',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '160px',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: '2px',
  },
  youTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '0.65rem',
    fontWeight: 700,
    background: 'rgba(73,192,248,0.15)',
    color: 'var(--accent-primary)',
    border: '1px solid rgba(73,192,248,0.3)',
    padding: '0.05rem 0.35rem',
    borderRadius: '999px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  },
  lvlChip: {
    fontSize: '0.75rem',
    fontWeight: 600,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)',
    padding: '0.15rem 0.5rem',
    borderRadius: '6px',
    color: 'var(--text-secondary)',
  },
};

export default Leaderboard;
