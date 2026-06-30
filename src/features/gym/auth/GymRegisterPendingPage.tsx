import { Link } from 'react-router-dom';
import { AuthShell } from '@/features/shared/AuthShell';

export function GymRegisterPendingPage() {
  return (
    <AuthShell
      heroTitle={<>Your gym is <span className="neon">almost live.</span></>}
      heroSubtitle="We're reviewing your registration. You'll receive an email once your gym shell is activated and ready for onboarding."
    >
      <h2>Registration submitted</h2>

      <p style={{ color: 'var(--ct-text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
        Our team is reviewing your gym details. Once approved, you'll receive credentials to access your admin console and start onboarding coaches and clients.
      </p>

      <Link to="/login" className="ct-auth-cta ct-press" style={{ textDecoration: 'none' }}>
        Back to sign in
      </Link>
    </AuthShell>
  );
}
