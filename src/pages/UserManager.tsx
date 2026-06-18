import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { GlassCard } from '../components/GlassCard';
import { Search, UserCog, ShieldCheck, Mail, Calendar } from 'lucide-react';

export const UserManager: React.FC = () => {
  const { usersList, updateUserRole, currentUser } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleRole = (userId: string, currentRole: 'student' | 'admin') => {
    // Avoid self-demotion during demo to prevent locking oneself out of admin
    if (currentUser && currentUser.id === userId && currentRole === 'admin') {
      alert("Pour la démo de soutenance, vous ne devriez pas vous rétrograder vous-même afin de conserver l'accès admin ! Utilisez le bouton en bas de la barre latérale pour basculer facilement.");
      return;
    }
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    updateUserRole(userId, newRole);
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Gestion des Utilisateurs</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Visualisez la liste des étudiants inscrits, surveillez leur progression globale et gérez les droits d'accès.
        </p>
      </div>

      <GlassCard style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher un étudiant par nom ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>
      </GlassCard>

      <GlassCard>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table" style={{ marginTop: 0 }}>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Email universitaire</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Niveau</th>
                <th style={{ width: '120px', textAlign: 'center' }}>XP</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Rôle</th>
                <th style={{ width: '180px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isAdmin = user.role === 'admin';
                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={styles.avatar}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600 }}>{user.name}</span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
                            <Calendar size={10} />
                            <span>Inscrit le {user.dateJoined}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={12} color="var(--text-muted)" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {isAdmin ? '--' : `Lvl ${user.level}`}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {isAdmin ? '--' : `${user.xp} XP`}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          ...styles.roleBadge,
                          backgroundColor: isAdmin ? 'rgba(168, 85, 247, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: isAdmin ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                        }}
                      >
                        {isAdmin ? 'Administrateur' : 'Étudiant'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleRole(user.id, user.role)}
                        className={`btn ${isAdmin ? 'btn-secondary' : 'btn-accent'}`}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                      >
                        {isAdmin ? (
                          <>
                            <UserCog size={12} />
                            <span>Passer Étudiant</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={12} />
                            <span>Promouvoir Admin</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    Aucun étudiant trouvé pour cette recherche.
                  </td>
                </tr>
              )}
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
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  avatar: {
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
  roleBadge: {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '0.15rem 0.5rem',
    borderRadius: '6px',
  },
};

export default UserManager;
