import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { StatusChip } from '@/components/ui/StatusChip';

export function CoachOnboardingPendingPage() {
  return (
    <div className="ct-auth-layout">
      <Panel className="ct-auth-card">
        <div className="ct-panel-body">
          <div style={{ marginBottom: 12 }}>
            <StatusChip label="Pending review" tone="pending" />
          </div>
          <h1>Application received</h1>
          <p style={{ color: 'var(--ct-text-muted)', marginBottom: 16, lineHeight: 1.55 }}>
            Your coach profile is pending operator review. Typical turnaround is 2–3 business days.
          </p>
          <ul style={{ fontSize: 14, color: 'var(--ct-text-body)', lineHeight: 1.6, marginBottom: 24, paddingLeft: 20 }}>
            <li>Certifications and credentials are being verified</li>
            <li>You will receive an email when approved or if more info is needed</li>
            <li>You cannot access the coach console until approval</li>
          </ul>
          <Link className="ct-btn-secondary ct-press" to="/login">
            Back to sign in
          </Link>
        </div>
      </Panel>
    </div>
  );
}
