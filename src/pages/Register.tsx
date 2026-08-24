import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Mail, User, Lock, ShieldAlert } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAppState();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (!email.includes('@')) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    if (password.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères.');
      return;
    }

    await register(name, email, password);
    navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      <div style={styles.blurBg1} />
      <div style={styles.blurBg2} />

      <GlassCard style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <span style={styles.logoIconText}>M</span>
          </div>
          <h1 style={styles.title}>Rejoindre Malloow<span style={{ color: 'var(--accent-primary)' }}>.ia</span></h1>
          <p style={styles.subtitle}>
            Créez votre compte étudiant pour démarrer votre apprentissage personnalisé
          </p>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <div style={styles.inputWrapper}>
              <User size={16} style={styles.inputIcon} />
              <input
                type="text"
                placeholder="Ex: Noël Isoa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Adresse email universitaire</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="noel.isoa@student.univ.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div style={styles.inputWrapper}>
              <Lock size={16} style={styles.inputIcon} />
              <input
                type="password"
                placeholder="Créer un mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
            Créer mon compte (+50 XP)
          </button>
        </form>

        <div style={styles.footer}>
          <span>Déjà inscrit ?</span>
          <button onClick={() => navigate('/login')} style={styles.loginLink}>
            Se connecter
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
    
  },
  blurBg1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.15)',
    filter: 'blur(80px)',
    top: '10%',
    left: '10%',
    zIndex: -1,
  },
  blurBg2: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'rgba(168, 85, 247, 0.12)',
    filter: 'blur(80px)',
    bottom: '10%',
    right: '10%',
    zIndex: -1,
  },
  card: {
    maxWidth: '480px',
    width: '100%',
    padding: '2.5rem 2rem',
    textAlign: 'center',
  },
  header: {
    marginBottom: '2rem',
  },
  logoBadge: {
    background: 'rgba(73, 192, 248, 0.12)',
    border: '2px solid rgba(73, 192, 248, 0.3)',
    borderRadius: '20px',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem auto',
    boxShadow: '0 0 24px rgba(73, 192, 248, 0.25)',
  },
  logoIconText: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 900,
    fontSize: '2rem',
    color: '#49c0f8',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    fontFamily: 'var(--font-heading)',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.4',
  },
  errorContainer: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.75rem',
    color: 'var(--accent-danger)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    textAlign: 'left',
    marginBottom: '1.25rem',
  },
  form: {
    textAlign: 'left',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    borderTop: '1px solid var(--glass-border)',
    paddingTop: '1.25rem',
    marginTop: '1.5rem',
  },
  loginLink: {
    background: 'transparent',
    border: 'none',
    color: 'var(--accent-primary)',
    cursor: 'pointer',
    fontWeight: 600,
    textDecoration: 'underline',
  },
};

export default Register;
