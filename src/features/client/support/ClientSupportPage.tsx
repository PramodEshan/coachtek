import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { clientService } from '@/services/api';
import { clearDraft, loadDraft, saveDraft } from '@/utils/draftStorage';

const FEEDBACK_DRAFT_KEY = 'client-feedback';

export function ClientSupportPage() {
  useRolePageLoading('client-main');

  return (
    <div className="ct-page" style={{ maxWidth: 560 }}>
      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Platform support</div>
          <p style={{ color: 'var(--ct-text-body)', lineHeight: 1.5, fontSize: 14 }}>
            Contact the CoachTek platform operator for billing, account, or technical issues your coach cannot resolve.
          </p>
          <p style={{ marginTop: 16, fontWeight: 600 }}>support@coachtek.app</p>
          <p style={{ color: 'var(--ct-text-muted)', fontSize: 14 }}>+44 20 7946 0958 · Mon–Fri 9am–6pm</p>
        </div>
      </Panel>
    </div>
  );
}

export function ClientFeedbackPage() {
  useRolePageLoading('client-main');
  const navigate = useNavigate();
  const draft = loadDraft<{ category: 'coach' | 'platform' | 'billing'; description: string }>(FEEDBACK_DRAFT_KEY);
  const [category, setCategory] = useState<'coach' | 'platform' | 'billing'>(draft?.category ?? 'coach');
  const [description, setDescription] = useState(draft?.description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function persistDraft(next: { category: typeof category; description: string }) {
    saveDraft(FEEDBACK_DRAFT_KEY, next);
  }

  async function handleSubmit() {
    if (!description.trim()) {
      setError('Please describe your feedback.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await clientService.submitFeedback({ category, description: description.trim() });
      clearDraft(FEEDBACK_DRAFT_KEY);
      navigate('/client/settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ct-page" style={{ maxWidth: 560 }}>
      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Submit feedback</div>
          <div className="ct-field">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => {
                const next = e.target.value as typeof category;
                setCategory(next);
                persistDraft({ category: next, description });
              }}
            >
              <option value="coach">Coach</option>
              <option value="platform">Platform</option>
              <option value="billing">Billing</option>
            </select>
          </div>
          <div className="ct-field">
            <label>Description</label>
            <textarea
              rows={5}
              placeholder="Describe your feedback or complaint…"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                persistDraft({ category, description: e.target.value });
              }}
            />
          </div>
          {error ? <p style={{ color: 'var(--ct-danger)', fontSize: 13, marginBottom: 12 }}>{error}</p> : null}
          <button type="button" className="ct-btn-primary ct-press" disabled={saving} onClick={handleSubmit}>
            {saving ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </Panel>
    </div>
  );
}
