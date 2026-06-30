import { useEffect, useState } from 'react';
import { Panel } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useCoachConsole, useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import { coachService, gymCoachService } from '@/services/api';
import type { CoachProfile } from '@/services/types';

export function CoachProfilePage() {
  const { user } = useAuth();
  const { variant } = useCoachConsole();
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [gymName, setGymName] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [tagline, setTagline] = useState('');
  const [intro, setIntro] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [saving, setSaving] = useState(false);

  useCoachConsoleLoading(profile === null);

  useEffect(() => {
    coachService.profile().then((p) => {
      setProfile(p);
      setTagline(p.tagline);
      setIntro(p.intro);
      setEmail(p.email ?? '');
      setWhatsapp(p.whatsappBusinessNumber ?? '');
    });
    if (variant === 'gym') {
      gymCoachService.gymName().then(setGymName);
    }
  }, [variant]);

  if (!profile) return null;

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await coachService.updateProfile({
        tagline,
        intro,
        email,
        whatsappBusinessNumber: whatsapp,
      });
      setProfile(updated);
      setEditOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ct-page" style={{ maxWidth: 860, gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--ct-text-muted)', lineHeight: 1.45 }}>
          {variant === 'gym'
            ? `Your coaching profile at ${gymName || 'your gym'}`
            : 'This is what clients see when they open your invite link'}
        </div>
        <button type="button" className="ct-btn-secondary ct-press" onClick={() => setEditOpen(true)}>
          Edit profile
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: 0,
          borderRadius: 'var(--ct-radius)',
          overflow: 'hidden',
          border: '1px solid var(--ct-border)',
          boxShadow: 'var(--ct-shadow-sm)',
        }}
      >
        <div style={{ background: 'var(--ct-hero-gradient-primary)', padding: 24, display: 'grid', placeItems: 'center' }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 'var(--ct-radius-pill)',
              background: 'rgba(255,255,255,0.18)',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--ct-font-display)',
              fontSize: 36,
              fontWeight: 600,
              color: 'var(--ct-on-inverse)',
            }}
          >
            {user?.initials ?? 'CT'}
          </div>
        </div>
        <div style={{ background: 'var(--ct-surface)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--ct-font-display)', fontSize: 28, fontWeight: 600, color: 'var(--ct-accent)' }}>
            Hello!
          </div>
          <div style={{ fontFamily: 'var(--ct-font-display)', fontSize: 22, fontWeight: 600, marginTop: 8 }}>
            {profile.tagline}
          </div>
          {variant === 'gym' && gymName ? (
            <div style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginTop: 6 }}>
              Gym coach · {gymName}
            </div>
          ) : null}
          <p style={{ color: 'var(--ct-text-body)', lineHeight: 1.55, marginTop: 12 }}>{profile.intro}</p>
        </div>
      </div>

      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontFamily: 'var(--ct-font-display)', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            Contact
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--ct-divider)' }}>
            <span style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>Email</span>
            <span style={{ fontWeight: 600 }}>{profile.email ?? '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0' }}>
            <span style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>WhatsApp</span>
            <span style={{ fontWeight: 600 }}>{profile.whatsappBusinessNumber ?? '—'}</span>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontFamily: 'var(--ct-font-display)', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            Details
          </div>
          {variant === 'gym' && gymName ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--ct-divider)' }}>
              <span style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>Gym</span>
              <span style={{ fontWeight: 600 }}>{gymName}</span>
            </div>
          ) : null}
          {profile.details.map((d) => (
            <div key={d.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--ct-divider)' }}>
              <span style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{d.label}</span>
              <span style={{ fontWeight: 600 }}>{d.value}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontFamily: 'var(--ct-font-display)', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            Certifications
          </div>
          {profile.certifications.map((c) => (
            <div key={c.name} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div style={{ color: 'var(--ct-text-muted)', fontSize: 13 }}>
                {c.issuer} · {c.year}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {profile.stats.map((s) => (
          <Panel key={s.key}>
            <div className="ct-panel-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--ct-font-display)', fontSize: 24, fontWeight: 600, marginTop: 6 }}>
                {s.value}
              </div>
            </div>
          </Panel>
        ))}
      </div>

      {editOpen ? (
        <div className="ct-modal-backdrop" role="dialog" aria-modal="true">
          <div className="ct-modal ct-modal-md">
            <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Edit profile</h2>
            <div className="ct-field" style={{ marginBottom: 12 }}>
              <label>Tagline</label>
              <input value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
            <div className="ct-field" style={{ marginBottom: 12 }}>
              <label>Introduction</label>
              <textarea rows={4} value={intro} onChange={(e) => setIntro(e.target.value)} />
            </div>
            <div className="ct-field" style={{ marginBottom: 12 }}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="ct-field" style={{ marginBottom: 16 }}>
              <label>WhatsApp business number</label>
              <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+44…" />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="ct-btn-secondary ct-press" onClick={() => setEditOpen(false)}>
                Cancel
              </button>
              <button type="button" className="ct-btn-primary ct-press" disabled={saving} onClick={handleSave}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
