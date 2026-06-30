import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui';

const ROLES = [
  { label: 'Solo coach', path: '/solo-coach/login', description: 'Manage clients, programs, and sessions' },
  { label: 'Gym coach', path: '/gym/coach/login', description: 'Deliver gym-assigned programs' },
  { label: 'Client', path: '/client/login', description: 'Train, log workouts, and track progress' },
  { label: 'Gym admin', path: '/gym/admin/login', description: 'Run your gym on CoachTek' },
  { label: 'Gym staff', path: '/gym/staff/login', description: 'Front desk and day-to-day ops' },
  { label: 'Operator', path: '/operator/login', description: 'Platform onboarding and support' },
  { label: 'Super admin', path: '/superadmin/login', description: 'Platform governance' },
];

export function SplashPage() {
  return (
    <div className="ct-auth-layout">
      <Panel className="ct-auth-card" style={{ maxWidth: 520 }}>
        <div className="ct-panel-body">
          <h1 style={{ marginBottom: 8 }}>CoachTek</h1>
          <p style={{ color: 'var(--ct-text-muted)', marginBottom: 24, lineHeight: 1.5 }}>
            Choose how you want to sign in.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ROLES.map((role) => (
              <Link
                key={role.path}
                to={role.path}
                className="ct-press"
                style={{
                  display: 'block',
                  padding: '14px 16px',
                  border: '1px solid var(--ct-border)',
                  borderRadius: 'var(--ct-radius)',
                  color: 'inherit',
                }}
              >
                <div style={{ fontWeight: 700 }}>{role.label}</div>
                <div style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginTop: 4 }}>{role.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
