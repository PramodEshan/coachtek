import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { IconDumbbell } from '@/components/icons';
import { authService, clientService } from '@/services/api';

const GOALS = ['Strength', 'Weight Loss', 'Endurance', 'Recovery'] as const;
const STEPS = ['Account', 'Legal', 'PAR-Q', 'Health', 'Profile'];

export function ClientRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [account, setAccount] = useState({ name: '', email: '', goal: 'Strength' as string });
  const [legalOk, setLegalOk] = useState({ terms: false, disclaimer: false });
  const [parq, setParq] = useState({ heart: false, pain: false, dizzy: false });
  const [profile, setProfile] = useState({ weight: '78', goals: 'Build strength', emergency: '' });

  const finish = async () => {
    await clientService.updateProfile({
      weight: Number(profile.weight),
      goals: profile.goals,
      emergencyContact: profile.emergency,
      parqComplete: true,
      legalAccepted: true,
      onboardingComplete: true,
    });
    await authService.completeClientOnboarding();
    navigate('/client/dashboard');
  };

  if (step === 0) {
    return (
      <div className="ct-auth-shell">
        <div className="ct-auth-theme-corner"><ThemeToggle variant="compact" /></div>
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: 'min(440px, 100%)', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', width: 52, height: 52, borderRadius: 'var(--ct-radius-sm)', background: 'var(--ct-accent-soft)', color: 'var(--ct-accent-dark)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <IconDumbbell size={26} />
            </div>
            <h2 style={{ fontFamily: 'var(--ct-font-display)', fontWeight: 700, fontSize: 26, marginBottom: 6 }}>
              Start Your Journey
            </h2>
            <p style={{ color: 'var(--ct-text-muted)', fontSize: 14, marginBottom: 32 }}>
              Join the elite TITAN ecosystem and crush your goals.
            </p>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="ct-field">
                <label htmlFor="cl-name">Full name</label>
                <input id="cl-name" placeholder="Enter your full name" value={account.name} onChange={(e) => setAccount((a) => ({ ...a, name: e.target.value }))} />
              </div>
              <div className="ct-field">
                <label htmlFor="cl-email">Email address</label>
                <input id="cl-email" type="email" placeholder="you@example.com" value={account.email} onChange={(e) => setAccount((a) => ({ ...a, email: e.target.value }))} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--ct-text-subhead)', fontWeight: 500, color: 'var(--ct-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Primary fitness goal
                </label>
                <div className="ct-auth-goal-grid">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`ct-auth-goal-btn ct-press${account.goal === g ? ' is-selected' : ''}`}
                      onClick={() => setAccount((a) => ({ ...a, goal: g }))}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="ct-auth-cta ct-press"
                disabled={!account.name.trim() || !account.email.trim()}
                onClick={() => setStep(1)}
              >
                Begin activation &rarr;
              </button>
            </div>

            <p style={{ marginTop: 20, fontSize: 14, color: 'var(--ct-text-muted)' }}>
              Already part of the team?{' '}
              <Link to="/login" style={{ color: 'var(--ct-neon-dark)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ct-auth-layout">
      <div className="ct-auth-theme-corner"><ThemeToggle variant="compact" /></div>
      <Panel className="ct-auth-card" style={{ maxWidth: 480 }}>
        <div className="ct-panel-body">
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Client onboarding</h1>
          <p style={{ color: 'var(--ct-text-muted)', marginBottom: 16, fontSize: 14 }}>
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
          <div className="ct-onboarding-progress">
            {STEPS.map((_, i) => (
              <div key={STEPS[i]} className={`ct-onboarding-dot${i <= step ? ' is-done' : ''}`} />
            ))}
          </div>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14 }}>
                <input type="checkbox" checked={legalOk.terms} onChange={(e) => setLegalOk((v) => ({ ...v, terms: e.target.checked }))} />
                I accept the Terms & Conditions
              </label>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14 }}>
                <input type="checkbox" checked={legalOk.disclaimer} onChange={(e) => setLegalOk((v) => ({ ...v, disclaimer: e.target.checked }))} />
                I accept the liability disclaimer
              </label>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              {([
                ['heart', 'Has a doctor ever said you have a heart condition?'],
                ['pain', 'Do you feel pain in your chest during physical activity?'],
                ['dizzy', 'Do you lose balance because of dizziness?'],
              ] as const).map(([key, label]) => (
                <label key={key} style={{ display: 'flex', gap: 10 }}>
                  <input type="checkbox" checked={parq[key]} onChange={(e) => setParq((v) => ({ ...v, [key]: e.target.checked }))} />
                  {label}
                </label>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="ct-field">
              <label>Health conditions or injuries</label>
              <textarea rows={3} defaultValue="Minor lower-back tightness" style={{ width: '100%' }} />
              <label style={{ display: 'flex', gap: 8, marginTop: 12, fontSize: 14 }}>
                <input type="checkbox" defaultChecked />
                I sign the liability waiver
              </label>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="ct-field">
                <label>Current weight (kg)</label>
                <input value={profile.weight} onChange={(e) => setProfile((p) => ({ ...p, weight: e.target.value }))} />
              </div>
              <div className="ct-field">
                <label>Fitness goals</label>
                <input value={profile.goals} onChange={(e) => setProfile((p) => ({ ...p, goals: e.target.value }))} />
              </div>
              <div className="ct-field">
                <label>Emergency contact</label>
                <input value={profile.emergency} onChange={(e) => setProfile((p) => ({ ...p, emergency: e.target.value }))} placeholder="Name · phone" />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {step > 0 && (
              <button type="button" className="ct-btn-secondary ct-press" onClick={() => setStep((s) => s - 1)}>Back</button>
            )}
            <button
              type="button"
              className="ct-btn-primary ct-press"
              style={{ flex: 1 }}
              disabled={step === 1 && (!legalOk.terms || !legalOk.disclaimer)}
              onClick={() => (step < STEPS.length - 1 ? setStep((s) => s + 1) : void finish())}
            >
              {step < STEPS.length - 1 ? 'Continue' : 'Finish setup'}
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
