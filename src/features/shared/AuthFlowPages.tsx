import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell } from '@/features/shared/AuthShell';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      heroTitle={<>Reset your <span className="neon">password.</span></>}
      heroSubtitle="Enter your email and we'll send a reset link so you can get back to managing your coaching business."
    >
      <h2>Reset password</h2>

      {sent ? (
        <p style={{ color: 'var(--ct-neon-dark)', marginBottom: 16, fontSize: 14 }}>
          If an account exists for {email}, a reset link has been sent.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div className="ct-field">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="ct-auth-cta ct-press">
            Send reset link
          </button>
        </form>
      )}

      <Link
        to="/login"
        style={{ display: 'inline-block', marginTop: 16, color: 'var(--ct-neon-dark)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}
      >
        Back to sign in
      </Link>
    </AuthShell>
  );
}

export function EmailVerificationPage() {
  return (
    <AuthShell
      heroTitle={<>Almost <span className="neon">there.</span></>}
      heroSubtitle="One last step before you can start managing your clients and programs."
    >
      <h2>Verify your email</h2>

      <p style={{ color: 'var(--ct-text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
        We sent a verification link to your inbox. Click the link to activate your account, then sign in.
      </p>
      <p style={{ fontSize: 13, color: 'var(--ct-text-body)', marginBottom: 24 }}>
        Did not receive it? Check spam or request a new link from support.
      </p>
      <Link to="/login" className="ct-auth-cta ct-press" style={{ textDecoration: 'none' }}>
        Continue to sign in
      </Link>
    </AuthShell>
  );
}
