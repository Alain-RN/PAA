import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button } from '../components';
import { Mail, Lock, Sparkles, User, ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAppState();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    const success = await login(email, password, role);
    if (success) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Identifiants incorrects. Vérifiez votre mot de passe.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.blurBg1} />
      <div style={styles.blurBg2} />

      <Card style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <span style={styles.logoIconText}>M</span>
          </div>
          <h1 className="font-heading" style={styles.title}>
            Malloow<span style={{ color: 'var(--accent-primary)' }}>.ia</span>
          </h1>
          <p className="font-body" style={styles.subtitle}>
            Plateforme d'apprentissage adaptative & gamifiée pour Licence Informatique
          </p>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.roleTabs}>
            <button
              type="button"
              onClick={() => { setRole('student'); setError(''); }}
              style={{
                ...styles.roleTab,
                ...(role === 'student' ? styles.roleTabActive : {}),
              }}
            >
              <User size={16} />
              <span>Étudiant</span>
            </button>
            <button
              type="button"
              onClick={() => { setRole('admin'); setError(''); }}
              style={{
                ...styles.roleTab,
                ...(role === 'admin' ? styles.roleTabActive : {}),
              }}
            >
              <Sparkles size={16} />
              <span>Administrateur</span>
            </button>
          </div>

          <Input
            label="Adresse email"
            iconLeft={<Mail size={16} />}
            type="email"
            placeholder={role === 'admin' ? 'admin@univ.fr' : 'nom@student.univ.fr'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            wrapperClassName="mb-1"
          />

          <Input
            label="Mot de passe"
            iconLeft={<Lock size={16} />}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            wrapperClassName="mb-1"
          />

          <Button type="submit" fullWidth style={{ marginTop: '0.75rem' }}>
            Se connecter
          </Button>
        </form>

        <div style={styles.footer}>
          <span>Pas encore inscrit ?</span>
          <button onClick={() => navigate('/register')} style={styles.registerLink}>
            Créer un compte
          </button>
        </div>
      </Card>
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
    fontSize: '2.2rem',
    letterSpacing: '0.02em',
    marginBottom: '0.5rem',
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
  roleTabs: {
    display: 'flex',
    gap: '0.5rem',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.25rem',
    marginBottom: '1.5rem',
  },
  roleTab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'var(--font-primary)',
    fontWeight: 500,
    fontSize: '0.85rem',
    transition: 'var(--transition-smooth)',
  },
  roleTabActive: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'var(--text-primary)',
    fontWeight: 600,
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
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
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '1.5rem 0',
  },
  dividerText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    background: 'transparent',
  },
  quickAccess: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  quickBtn: {
    justifyContent: 'center',
    padding: '0.6rem',
    fontSize: '0.85rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    borderTop: '1px solid var(--glass-border)',
    paddingTop: '1.25rem',
  },
  registerLink: {
    background: 'transparent',
    border: 'none',
    color: 'var(--accent-primary)',
    cursor: 'pointer',
    fontWeight: 600,
    textDecoration: 'underline',
  },
};

export default Login;
