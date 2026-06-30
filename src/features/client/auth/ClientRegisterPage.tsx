import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { authService } from '@/services/api';
import { clientService } from '@/services/api';

const STEPS = ['Account', 'Legal', 'PAR-Q', 'Health', 'Profile'];

export function ClientRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
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

          {step === 0 ? (
            <p style={{ fontSize: 14, color: 'var(--ct-text-body)', lineHeight: 1.5 }}>
              Create your account with your coach invite or sign in with the demo client account on the login page.
            </p>
          ) : null}

          {step === 1 ? (
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
          ) : null}

          {step === 2 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              {[
                ['heart', 'Has a doctor ever said you have a heart condition?'],
                ['pain', 'Do you feel pain in your chest during physical activity?'],
                ['dizzy', 'Do you lose balance because of dizziness?'],
              ].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', gap: 10 }}>
                  <input type="checkbox" checked={parq[key as keyof typeof parq]} onChange={(e) => setParq((v) => ({ ...v, [key]: e.target.checked }))} />
                  {label}
                </label>
              ))}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="ct-field">
              <label>Health conditions or injuries</label>
              <textarea rows={3} defaultValue="Minor lower-back tightness" style={{ width: '100%' }} />
              <label style={{ display: 'flex', gap: 8, marginTop: 12, fontSize: 14 }}>
                <input type="checkbox" defaultChecked />
                I sign the liability waiver
              </label>
            </div>
          ) : null}

          {step === 4 ? (
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
          ) : null}

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {step > 0 ? (
              <button type="button" className="ct-btn-secondary ct-press" onClick={() => setStep((s) => s - 1)}>Back</button>
            ) : null}
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
