import { useEffect, useState } from 'react';
import { Panel } from '@/components/ui';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { operatorService } from '@/services/api';
import type { SubscriptionTier } from '@/services/types';

export function OperatorTiersPage() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTier, setEditTier] = useState<SubscriptionTier | null>(null);
  const [monthlyFee, setMonthlyFee] = useState(0);
  const [clientLimit, setClientLimit] = useState(0);
  const [saving, setSaving] = useState(false);

  useRolePageLoading('operator-main', loading);

  useEffect(() => {
    operatorService.tiers().then(setTiers).finally(() => setLoading(false));
  }, []);

  function openEdit(tier: SubscriptionTier) {
    setEditTier(tier);
    setMonthlyFee(tier.monthlyFee);
    setClientLimit(tier.clientLimit);
  }

  async function handleSave() {
    if (!editTier) return;
    setSaving(true);
    try {
      await operatorService.updateTier(editTier.id, { monthlyFee, clientLimit });
      setTiers(await operatorService.tiers());
      setEditTier(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ct-page">
      <Panel style={{ overflow: 'hidden' }}>
        <div className="ct-table-head ct-clients-table-head">
          <span>Tier</span>
          <span>Client limit</span>
          <span>Registration</span>
          <span>Monthly</span>
          <span />
        </div>
        {tiers.map((tier) => (
          <div key={tier.id} className="ct-row ct-table-row ct-clients-row">
            <span style={{ fontWeight: 600 }}>{tier.name}</span>
            <span>{tier.clientLimit >= 999 ? 'Custom' : tier.clientLimit}</span>
            <span>${tier.registrationFee || 'Custom'}</span>
            <span>${tier.monthlyFee}/mo</span>
            <button
              type="button"
              className="ct-btn-secondary ct-press"
              style={{ fontSize: 12 }}
              onClick={() => openEdit(tier)}
            >
              Edit
            </button>
          </div>
        ))}
      </Panel>

      {editTier ? (
        <div className="ct-modal-backdrop" role="dialog" aria-modal="true">
          <div className="ct-modal ct-modal-sm">
            <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Edit tier</h2>
            <p style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginBottom: 16 }}>{editTier.name}</p>
            <div className="ct-field" style={{ marginBottom: 12 }}>
              <label>Monthly fee ($)</label>
              <input type="number" min={0} value={monthlyFee} onChange={(e) => setMonthlyFee(Number(e.target.value))} />
            </div>
            <div className="ct-field" style={{ marginBottom: 16 }}>
              <label>Client limit</label>
              <input type="number" min={1} value={clientLimit} onChange={(e) => setClientLimit(Number(e.target.value))} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="ct-btn-secondary ct-press" onClick={() => setEditTier(null)}>
                Cancel
              </button>
              <button type="button" className="ct-btn-primary ct-press" disabled={saving} onClick={handleSave}>
                {saving ? 'Saving…' : 'Save tier'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
