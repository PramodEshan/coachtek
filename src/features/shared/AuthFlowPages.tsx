import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="ct-auth-layout">
      <Panel className="ct-auth-card">
        <div className="ct-panel-body">
          <h1>Reset password</h1>
          <p style={{ color: 'var(--ct-text-muted)', marginBottom: 24, lineHeight: 1.55 }}>
            Enter your email and we will send a reset link.
          </p>
          {sent ? (
            <p style={{ color: 'var(--ct-neon-dark)', marginBottom: 16 }}>
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
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="ct-btn-primary ct-press">
                Send reset link
              </button>
            </form>
          )}
          <Link to="/solo-coach/login" className="ct-btn-secondary ct-press" style={{ marginTop: 16, display: 'inline-block' }}>
            Back to sign in
          </Link>
        </div>
      </Panel>
    </div>
  );
}

export function EmailVerificationPage() {
  return (
    <div className="ct-auth-layout">
      <Panel className="ct-auth-card">
        <div className="ct-panel-body">
          <h1>Verify your email</h1>
          <p style={{ color: 'var(--ct-text-muted)', marginBottom: 24, lineHeight: 1.55 }}>
            We sent a verification link to your inbox. Click the link to activate your account, then sign in.
          </p>
          <p style={{ fontSize: 13, color: 'var(--ct-text-body)', marginBottom: 16 }}>
            Did not receive it? Check spam or request a new link from support.
          </p>
          <Link to="/solo-coach/login" className="ct-btn-primary ct-press">
            Continue to sign in
          </Link>
        </div>
      </Panel>
    </div>
  );
}
