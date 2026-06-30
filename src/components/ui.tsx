import type { CSSProperties, ReactNode } from 'react';
import type { Tint } from '@/services/types';
import { avatarClass } from '@/utils/coachUi';

export function Avatar({
  initials,
  tint = 'sage',
  size = 38,
  shape = 'round',
  src,
  alt = '',
}: {
  initials: string;
  tint?: Tint;
  size?: number;
  shape?: 'round' | 'square';
  src?: string;
  alt?: string;
}) {
  const radius = shape === 'round' ? '999px' : undefined;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={avatarClass(tint, shape)}
        style={{ width: size, height: size, borderRadius: radius, objectFit: 'cover' }}
      />
    );
  }

  return (
    <div
      className={avatarClass(tint, shape)}
      style={{ width: size, height: size, fontSize: size * 0.32, borderRadius: radius }}
    >
      {initials}
    </div>
  );
}

export function Panel({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`ct-panel ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="ct-panel-header">
      <span className="ct-panel-header-title">{title}</span>
      {action}
    </div>
  );
}

export function SearchBar({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="ct-search">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--ct-text-muted)" strokeWidth="1.8">
        <circle cx="11" cy="11" r="6" />
        <path d="M16 16l4 4" />
      </svg>
      {onChange ? (
        <input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <span style={{ fontSize: 14, color: 'var(--ct-text-muted)' }}>{placeholder}</span>
      )}
    </div>
  );
}

export function SectionDivider({ title }: { title: string }) {
  return (
    <div className="ct-section-divider">
      <h2>{title}</h2>
      <div className="ct-section-divider-line" />
    </div>
  );
}
