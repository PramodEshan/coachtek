import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { clientService } from '@/services/api';
import type { ClientPaymentRecord, ClientProfile } from '@/services/types';

export function ClientSettingsPage() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [payments, setPayments] = useState<ClientPaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [weight, setWeight] = useState('');
  const [goals, setGoals] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveNote, setSaveNote] = useState<string | null>(null);

  useRolePageLoading('client-main', loading);

  useEffect(() => {
    Promise.all([clientService.profile(), clientService.paymentHistory()])
      .then(([p, h]) => {
        setProfile(p);
        setPayments(h);
        setWeight(String(p.weight ?? ''));
        setGoals(p.goals ?? '');
        setEmergencyContact(p.emergencyContact ?? '');
        setWhatsappNumber(p.whatsappNumber ?? '');
        setWhatsappOptIn(p.whatsappOptIn ?? false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!profile) return null;

  const payeeLabel = profile.paymentPayeeName
    ? `Billed by ${profile.paymentPayeeName}`
    : profile.paymentPayee === 'gym'
      ? 'Billed by your gym'
      : `Billed by ${profile.coachName}`;

  async function handleSaveProfile() {
    setSaving(true);
    setSaveNote(null);
    try {
      const updated = await clientService.updateProfile({
        weight: weight ? Number(weight) : undefined,
        goals,
        emergencyContact,
        whatsappNumber,
        whatsappOptIn,
      });
      setProfile(updated);
      setSaveNote('Profile saved.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ct-page" style={{ maxWidth: 640, gap: 16 }}>
      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Profile</div>
          <div className="ct-field">
            <label>Weight (kg)</label>
            <input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" step="0.1" />
          </div>
          <div className="ct-field">
            <label>Goals</label>
            <input value={goals} onChange={(e) => setGoals(e.target.value)} />
          </div>
          <div className="ct-field">
            <label>Emergency contact</label>
            <input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
          </div>
          <div className="ct-field">
            <label>WhatsApp number</label>
            <input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="+44…" />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 12 }}>
            <input type="checkbox" checked={whatsappOptIn} onChange={(e) => setWhatsappOptIn(e.target.checked)} />
            Allow coach to contact me on WhatsApp
          </label>
          {saveNote ? (
            <p style={{ fontSize: 13, color: 'var(--ct-neon-dark)', marginBottom: 12 }}>{saveNote}</p>
          ) : null}
          <button type="button" className="ct-btn-primary ct-press" disabled={saving} onClick={handleSaveProfile}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </Panel>
      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Subscription</div>
          <p style={{ fontSize: 14, color: 'var(--ct-text-muted)' }}>
            Status: {profile.subscriptionStatus} · Renews {profile.renewalDate}
          </p>
          <p style={{ fontSize: 13, color: 'var(--ct-text-body)', marginTop: 6 }}>{payeeLabel}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="ct-btn-secondary ct-press"
              onClick={() => void clientService.pauseSubscription().then(() => clientService.profile().then(setProfile))}
            >
              Pause subscription
            </button>
          </div>
        </div>
      </Panel>

      {payments.length > 0 && (
        <Panel>
          <div className="ct-panel-body">
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Payment history</div>
            {payments.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--ct-divider)',
                  fontSize: 13,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{p.payeeName}</div>
                  <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{p.date}</div>
                </div>
                <div style={{ fontWeight: 700 }}>£{p.amount}</div>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    background:
                      p.status === 'paid' ? 'var(--ct-accent-soft)' : p.status === 'pending' ? '#fff3cd' : '#fde8e8',
                    color: p.status === 'paid' ? 'var(--ct-neon-dark)' : p.status === 'pending' ? '#664d03' : '#9b1c1c',
                  }}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Data export</div>
          <button
            type="button"
            className="ct-btn-secondary ct-press"
            disabled={exporting}
            onClick={async () => {
              setExporting(true);
              const csv = await clientService.exportData();
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'coachtek-export.csv';
              a.click();
              setExporting(false);
            }}
          >
            {exporting ? 'Exporting…' : 'Export my data'}
          </button>
        </div>
      </Panel>
      <Link to="/client/feedback/new" className="ct-btn-secondary ct-press">
        Submit feedback
      </Link>
      <Link to="/client/support" className="ct-btn-secondary ct-press">
        Platform support
      </Link>
    </div>
  );
}
