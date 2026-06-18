import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { GlassCard } from '../components/GlassCard';
import { History, Award, BookOpen, Clock, Flame, Cpu } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { historyLogs } = useAppState();

  const renderLogIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <Award size={16} color="var(--accent-secondary)" />;
      case 'chapter':
        return <BookOpen size={16} color="var(--accent-primary)" />;
      case 'badge':
        return <Cpu size={16} color="var(--accent-warning)" />;
      case 'streak':
        return <Flame size={16} color="var(--accent-warning)" />;
      default:
        return <Clock size={16} color="var(--text-muted)" />;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Journal d'Historique</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Consultez la traçabilité complète de vos efforts pédagogiques et gains d'XP récents.
        </p>
      </div>

      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <History size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.1rem' }}>Historique d'activité persistant</h3>
        </div>

        {historyLogs.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Aucune activité enregistrée pour le moment.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Type</th>
                  <th style={{ width: '150px' }}>Date</th>
                  <th>Action Réalisée</th>
                  <th style={{ width: '100px', textAlign: 'right' }}>XP Gagné</th>
                </tr>
              </thead>
              <tbody>
                {historyLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ textAlign: 'center' }}>
                      <div style={styles.iconContainer}>{renderLogIcon(log.type)}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {formatDate(log.date)}
                    </td>
                    <td style={{ fontWeight: 550, fontSize: '0.9rem' }}>{log.action}</td>
                    <td
                      style={{
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: log.xpGained > 0 ? 'var(--accent-success)' : 'var(--text-muted)',
                      }}
                    >
                      {log.xpGained > 0 ? `+${log.xpGained} XP` : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '2rem',
  },
  iconContainer: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
};

export default HistoryPage;
