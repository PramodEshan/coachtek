import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { IconDumbbell, IconBarChart } from '@/components/icons';

export function RegisterPathPage() {
  return (
    <div className="ct-auth-path-page">
      <div className="ct-auth-theme-corner">
        <ThemeToggle variant="compact" />
      </div>

      <Link to="/login" className="ct-auth-brand">Coachtek</Link>

      <h1 className="ct-auth-path-title">
        Choose your <span className="neon">path</span>
      </h1>
      <p className="ct-auth-path-sub">
        Select your role to unlock a tailored ecosystem of performance tools and professional growth.
      </p>

      <div className="ct-auth-path-grid">
        <div className="ct-auth-path-card">
          <div className="ct-auth-path-icon">
            <IconDumbbell size={24} />
          </div>
          <h3>I'm a Coach</h3>
          <p>
            Build your business, track clients, and scale your influence.
            Specialized tools for solo-coaches to manage programming and performance analytics.
          </p>
          <Link to="/solo-coach/register" className="ct-auth-path-link ct-press">
            Get started &rarr;
          </Link>
        </div>

        <div className="ct-auth-path-card">
          <div className="ct-auth-path-icon">
            <IconBarChart size={24} />
          </div>
          <h3>I'm a Client</h3>
          <p>
            Reach your goals, track progress, and connect with expert coaches.
            Personalized dashboard for workout logs, biometric data, and direct coach communication.
          </p>
          <Link to="/client/register" className="ct-auth-path-link ct-press">
            Enter portal &rarr;
          </Link>
        </div>
      </div>

      <div className="ct-auth-gym-footer">
        <Link to="/gym/register">
          &#9881; Looking for gym registration? Click here
        </Link>
      </div>

      <p style={{ marginTop: 32, fontSize: 14, color: 'var(--ct-text-muted)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--ct-neon-dark)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
      </p>
    </div>
  );
}
