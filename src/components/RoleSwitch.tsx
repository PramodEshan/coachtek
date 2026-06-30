import { useState, type CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconChevLeft, IconChevRight, IconMark, IconSwitch } from '@/components/icons';
import { ROLE_LABELS, ROLE_PATHS } from '@/config/roles';
import { useAuth } from '@/context/AuthContext';
import type { RoleKey } from '@/services/types';

const ROLES: RoleKey[] = ['solo_coach', 'gym_coach', 'client', 'gym_admin', 'gym_staff', 'operator', 'superadmin'];

const roleItemStyle = (active: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 11,
  padding: '9px 10px',
  borderRadius: 'var(--ct-radius-sm)',
  marginBottom: 2,
  width: '100%',
  textAlign: 'left',
  border: active ? '1px solid var(--ct-outline-variant)' : '1px solid transparent',
  background: active ? 'var(--ct-accent-soft)' : 'transparent',
  cursor: 'pointer',
  color: 'inherit',
  font: 'inherit',
});

export function RoleSwitchPopover({ current, onClose }: { current: RoleKey; onClose?: () => void }) {
  const { switchToRole, user } = useAuth();
  const navigate = useNavigate();
  const [switching, setSwitching] = useState<RoleKey | null>(null);

  const handleSwitch = async (role: RoleKey) => {
    if (switching) return;
    onClose?.();
    if (user?.role === role) {
      navigate(ROLE_PATHS[role]);
      return;
    }
    setSwitching(role);
    try {
      await switchToRole(role);
      navigate(ROLE_PATHS[role]);
    } finally {
      setSwitching(null);
    }
  };

  return (
    <>
      <div style={{ fontSize: 11.5, fontWeight: 700, padding: '6px 10px 2px' }}>Switch view</div>
      <div style={{ fontSize: 10.5, color: 'var(--ct-text-muted)', padding: '0 10px 6px' }}>
        Preview different console UIs
      </div>
      {ROLES.map((role) => {
        const active = role === current;
        const busy = switching === role;
        return (
          <button
            key={role}
            type="button"
            className="ct-press"
            disabled={switching !== null}
            style={roleItemStyle(active)}
            onClick={() => void handleSwitch(role)}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--ct-radius-sm)',
                background: active ? 'var(--ct-accent-soft)' : 'var(--ct-surface-soft)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: 12,
                color: 'var(--ct-accent-dark)',
                flexShrink: 0,
              }}
            >
              {ROLE_LABELS[role].slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{ROLE_LABELS[role]}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ct-text-muted)' }}>
                {busy ? 'Switching…' : ROLE_PATHS[role]}
              </div>
            </div>
            {active ? <IconMark size={18} color="var(--ct-accent)" /> : null}
          </button>
        );
      })}
      <div style={{ fontSize: 10, color: 'var(--ct-text-muted)', padding: '8px 10px 4px', lineHeight: 1.4 }}>
        Signs in with demo account for each role
      </div>
    </>
  );
}

export function RoleSwitchSheet({ current, onClose }: { current: RoleKey; onClose: () => void }) {
  return (
    <div className="ct-role-switch-backdrop" onClick={onClose}>
      <div
        className="ct-role-switch-sheet ct-scroll"
        role="dialog"
        aria-modal="true"
        aria-label="Switch view"
        onClick={(event) => event.stopPropagation()}
      >
        <RoleSwitchPopover current={current} onClose={onClose} />
        <div className="ct-notifications-sheet-footer">
          <button type="button" className="ct-press ct-notifications-back" onClick={onClose}>
            <IconChevLeft size={18} />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export function RoleSwitchFooter({ current }: { current: RoleKey }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="ct-sidebar-footer">
      {open ? (
        <div className="ct-popover ct-scroll">
          <RoleSwitchPopover current={current} onClose={() => setOpen(false)} />
        </div>
      ) : null}
      <button type="button" className="ct-press ct-switch-btn" onClick={() => setOpen((v) => !v)}>
        <IconSwitch size={14} />
        Switch view
      </button>
      <Link to={ROLE_PATHS[current]} className="ct-press ct-profile-card" style={{ marginBottom: 0 }}>
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{ROLE_LABELS[current]} console</span>
        <IconChevRight size={16} color="var(--ct-text-muted)" />
      </Link>
    </div>
  );
}
