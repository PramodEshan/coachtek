import { useEffect, useState } from 'react';
import { Panel } from '@/components/ui';
import { IconLink } from '@/components/icons';
import { useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import { coachService, programsService } from '@/services/api';
import type { InviteLink, Program } from '@/services/types';

export function CoachInvitesPage() {
  const [invites, setInvites] = useState<InviteLink[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [program, setProgram] = useState('');
  const [label, setLabel] = useState('');
  const [generating, setGenerating] = useState(false);

  useCoachConsoleLoading(loading);

  useEffect(() => {
    Promise.all([coachService.invites(), programsService.list()])
      .then(([rows, programList]) => {
        setInvites(rows);
        setPrograms(programList);
        setProgram(programList[0]?.name ?? 'Open coaching');
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const invite = await coachService.generateInvite(program, label.trim() || undefined);
      setInvites((rows) => [invite, ...rows]);
      setModalOpen(false);
      setLabel('');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="ct-page" style={{ maxWidth: 860, gap: 16 }}>
      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontSize: 14, color: 'var(--ct-text-body)', lineHeight: 1.55, marginBottom: 16 }}>
            Create shareable links for your page, bio, or socials — clients join when they sign up.
          </div>
          <button type="button" className="ct-btn-primary ct-btn-primary-lg ct-press" onClick={() => setModalOpen(true)}>
            <IconLink size={18} />
            Generate link
          </button>
        </div>
      </Panel>

      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ct-text-muted)', marginBottom: 10 }}>
          Your links
        </div>
        {invites.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--ct-text-muted)' }}>No invite links yet.</p>
        ) : null}
        {invites.map((invite) => (
          <Panel key={invite.id} style={{ marginBottom: 10 }}>
            <div className="ct-panel-body" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{invite.label}</div>
                <div style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginTop: 4 }}>
                  {invite.program} · created {invite.created} · {invite.uses} uses
                </div>
                <code style={{ fontSize: 12, color: 'var(--ct-text-body)', marginTop: 6, display: 'block' }}>
                  https://coachtek.app/join/{invite.id}
                </code>
              </div>
              <span className="ct-pill ct-pill-replied">{invite.uses ? 'Active' : 'Draft'}</span>
            </div>
          </Panel>
        ))}
      </div>

      {modalOpen ? (
        <div className="ct-modal-backdrop" role="dialog" aria-modal="true">
          <div className="ct-modal ct-modal-sm">
            <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Generate invite link</h2>
            <div className="ct-field" style={{ marginBottom: 12 }}>
              <label>Program</label>
              <select value={program} onChange={(e) => setProgram(e.target.value)}>
                {programs.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
                {!programs.length ? <option>Open coaching</option> : null}
              </select>
            </div>
            <div className="ct-field" style={{ marginBottom: 16 }}>
              <label>Label (optional)</label>
              <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Instagram bio link" />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="ct-btn-secondary ct-press" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="ct-btn-primary ct-press" disabled={generating} onClick={handleGenerate}>
                {generating ? 'Creating…' : 'Create link'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
