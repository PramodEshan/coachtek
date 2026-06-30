import { Link } from 'react-router-dom';
import { ROLE_LABELS } from '@/config/roles';
import { Panel } from '@/components/ui';
import { RoleSwitchFooter } from '@/components/RoleSwitch';
import type { RoleKey } from '@/services/types';

export function PlaceholderRole({ role }: { role: RoleKey }) {
  return (
    <div className="ct-shell">
      <header className="ct-topbar">
        <div className="ct-topbar-brand-col">
          <div className="ct-topbar-brand">
            <div className="ct-brand-mark">CT</div>
            <div>
              <div style={{ fontFamily: 'var(--ct-font-display)', fontSize: 18, fontWeight: 700 }}>CoachTek</div>
              <div style={{ fontSize: 11, color: 'var(--ct-text-muted)' }}>Platform console</div>
            </div>
          </div>
        </div>
        <div className="ct-topbar-main">
          <div className="ct-topbar-title">
            <h1>{ROLE_LABELS[role]}</h1>
            <p>Reserved for future work</p>
          </div>
        </div>
      </header>
      <div className="ct-body">
        <aside className="ct-sidebar">
          <div style={{ flex: 1 }} />
          <RoleSwitchFooter current={role} />
        </aside>
        <main className="ct-main">
          <Panel>
            <div className="ct-panel-body" style={{ textAlign: 'center', color: 'var(--ct-text-muted)' }}>
              <p>The {ROLE_LABELS[role].toLowerCase()} console will be built in a later phase.</p>
              <p style={{ marginTop: 8 }}>
                <Link to="/solo-coach/dashboard" style={{ color: 'var(--ct-accent)', fontWeight: 600 }}>
                  Return to solo coach console
                </Link>
              </p>
            </div>
          </Panel>
        </main>
      </div>
    </div>
  );
}
