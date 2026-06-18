import React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** Nom complet — les initiales seront extraites automatiquement */
  name: string;
  /** Taille de l'avatar */
  size?: AvatarSize;
  /** Couleur de fond personnalisée (utilise un gradient par défaut) */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap: Record<AvatarSize, { width: string; fontSize: string }> = {
  xs: { width: '28px', fontSize: '0.65rem' },
  sm: { width: '36px', fontSize: '0.75rem' },
  md: { width: '44px', fontSize: '0.9rem' },
  lg: { width: '56px', fontSize: '1.1rem' },
  xl: { width: '72px', fontSize: '1.4rem' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

/** Génère une couleur de gradient déterministe basée sur le nom */
function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  color,
  className = '',
  style,
}) => {
  const { width, fontSize } = sizeMap[size];
  const bg = color ?? nameToColor(name);

  return (
    <div
      className={className}
      style={{
        width,
        height: width,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${bg}, ${bg}88)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize,
        fontFamily: 'var(--font-heading)',
        flexShrink: 0,
        border: '2px solid rgba(255,255,255,0.1)',
        ...style,
      }}
      title={name}
      aria-label={`Avatar de ${name}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
