import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { GlassCard } from '../components/GlassCard';
import { Trophy, Crown, Star } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { leaderboard, currentUser } = useAppState();

  if (!currentUser) return null;

  // Extract Top 3 for the podium
  const top3 = leaderboard.slice(0, 3);
  // Rest of the ranks is not used directly, we map the entire leaderboard in table

  const renderRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={18} color="#fbbf24" fill="#fbbf24" />;
      case 2:
        return <Trophy size={16} color="#94a3b8" fill="#94a3b8" />;
      case 3:
        return <Trophy size={16} color="#b45309" fill="#b45309" />;
      default:
        return <Star size={14} color="var(--text-muted)" />;
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Classement Général</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Mesurez-vous aux meilleurs étudiants de la promotion. Gagnez de l'XP en complétant des cours adaptatifs.
        </p>
      </div>

      {/* Podium Top 3 (Visual wow effect for defense) */}
      <div style={styles.podiumContainer}>
        {/* Rank 2 */}
        {top3[1] && (
          <div style={{ ...styles.podiumBase, height: '140px' }}>
            <div style={styles.podiumAvatarOuter}>
              <div style={{ ...styles.podiumAvatar, borderColor: '#94a3b8' }}>
                {top3[1].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ ...styles.podiumBadge, backgroundColor: '#94a3b8' }}>2</div>
            </div>
            <div style={styles.podiumName}>{top3[1].name}</div>
            <div style={styles.podiumXp}>{top3[1].xp} XP</div>
            <div style={{ ...styles.podiumBlock, background: 'linear-gradient(0deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.1) 100%)' }} />
          </div>
        )}

        {/* Rank 1 (Tallest) */}
        {top3[0] && (
          <div style={{ ...styles.podiumBase, height: '180px', transform: 'translateY(-20px)' }}>
            <div style={styles.podiumCrown}>
              <Crown size={24} color="#fbbf24" fill="#fbbf24" style={{ animation: 'bounce 2s infinite' }} />
            </div>
            <div style={styles.podiumAvatarOuter}>
              <div style={{ ...styles.podiumAvatar, borderColor: '#fbbf24', width: '64px', height: '64px', fontSize: '1.25rem' }}>
                {top3[0].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ ...styles.podiumBadge, backgroundColor: '#fbbf24', width: '22px', height: '22px', fontSize: '0.85rem' }}>1</div>
            </div>
            <div style={{ ...styles.podiumName, fontWeight: 'bold' }}>{top3[0].name}</div>
            <div style={{ ...styles.podiumXp, color: '#fbbf24', fontWeight: 'bold' }}>{top3[0].xp} XP</div>
            <div style={{ ...styles.podiumBlock, background: 'linear-gradient(0deg, rgba(251,191,36,0.05) 0%, rgba(251,191,36,0.2) 100%)' }} />
          </div>
        )}

        {/* Rank 3 */}
        {top3[2] && (
          <div style={{ ...styles.podiumBase, height: '120px' }}>
            <div style={styles.podiumAvatarOuter}>
              <div style={{ ...styles.podiumAvatar, borderColor: '#b45309' }}>
                {top3[2].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ ...styles.podiumBadge, backgroundColor: '#b45309' }}>3</div>
            </div>
            <div style={styles.podiumName}>{top3[2].name}</div>
            <div style={styles.podiumXp}>{top3[2].xp} XP</div>
            <div style={{ ...styles.podiumBlock, background: 'linear-gradient(0deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.07) 100%)' }} />
          </div>
        )}
      </div>

      {/* Leaderboard Table List */}
      <GlassCard>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table" style={{ marginTop: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>Rang</th>
                <th>Étudiant</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Badge Majeur</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Niveau</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Score XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => {
                const isUser = entry.isCurrentUser || entry.name === currentUser.name;
                return (
                  <tr
                    key={entry.rank}
                    style={{
                      backgroundColor: isUser ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                      borderLeft: isUser ? '3px solid var(--accent-primary)' : 'none',
                    }}
                  >
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                        {renderRankMedal(entry.rank)}
                        <span>{entry.rank}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={styles.tableAvatar}>
                          {entry.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span style={{ fontWeight: isUser ? 'bold' : 500 }}>{entry.name}</span>
                          {isUser && <span style={styles.userTag}>Vous</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '1.25rem' }}>
                      {entry.primaryBadge}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>Lvl {entry.level}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      {entry.xp} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '2rem',
  },
  podiumContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: '2rem',
    margin: '3rem 0 4rem 0',
    flexWrap: 'wrap',
  },
  podiumBase: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '160px',
    position: 'relative',
  },
  podiumCrown: {
    position: 'absolute',
    top: '-35px',
    zIndex: 2,
  },
  podiumAvatarOuter: {
    position: 'relative',
    marginBottom: '0.75rem',
  },
  podiumAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    border: '3px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: '1.1rem',
  },
  podiumBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  podiumName: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    textAlign: 'center',
    marginBottom: '0.25rem',
  },
  podiumXp: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
  },
  podiumBlock: {
    width: '100%',
    height: '80px',
    borderRadius: '8px 8px 0 0',
    border: '1px solid var(--glass-border)',
    borderBottom: 'none',
  },
  tableAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--glass-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: 'var(--text-secondary)',
  },
  userTag: {
    marginLeft: '0.5rem',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    background: 'var(--accent-primary)',
    color: '#fff',
    padding: '0.1rem 0.35rem',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
};

export default Leaderboard;
