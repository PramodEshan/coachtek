import { useEffect, useState } from 'react';
import { Panel } from '@/components/ui';
import { IconWallet } from '@/components/icons';
import { useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import { gymCoachService } from '@/services/api';
import type { GymCoachPayout } from '@/services/types';

export function GymCoachPayrollPage() {
  const [payouts, setPayouts] = useState<GymCoachPayout[]>([]);
  const [gymName, setGymName] = useState('');
  const [loading, setLoading] = useState(true);

  useCoachConsoleLoading(loading);

  useEffect(() => {
    Promise.all([
      gymCoachService.payroll().then(setPayouts),
      gymCoachService.gymName().then(setGymName),
    ]).finally(() => setLoading(false));
  }, []);

  const total = payouts.reduce((sum, p) => sum + p.amount, 0);
  const latest = payouts[0];

  return (
    <div className="ct-page" style={{ maxWidth: 860, gap: 16 }}>
      <Panel>
        <div className="ct-panel-body" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--ct-text-muted)', marginBottom: 4 }}>
            <IconWallet size={16} style={{ verticalAlign: -3, marginRight: 4 }} />
            Paid by {gymName || 'your gym'}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>£{total.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>
            Total payroll ({payouts.length} entries)
          </div>
          {latest ? (
            <p style={{ fontSize: 13, color: 'var(--ct-text-body)', marginTop: 12, lineHeight: 1.5 }}>
              Latest period: {latest.period} · {latest.status}
              {latest.paidDate ? ` · paid ${latest.paidDate}` : ''}
            </p>
          ) : null}
          <p style={{ fontSize: 12, color: 'var(--ct-text-muted)', marginTop: 8 }}>
            Gym coaches are paid monthly by the gym — no direct client payouts or earnings tracking.
          </p>
        </div>
      </Panel>

      <Panel>
        <div className="ct-panel-body">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Payment history</h3>
          {payouts.length === 0 ? (
            <p style={{ color: 'var(--ct-text-muted)', fontSize: 13 }}>No payroll records yet</p>
          ) : (
            payouts.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '10px 0',
                  borderBottom: '1px solid var(--ct-divider)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.period}</div>
                  <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>
                    {p.paidDate ? `Paid ${p.paidDate}` : p.status === 'processing' ? 'Processing' : 'Pending'}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>£{p.amount.toLocaleString()}</div>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    background:
                      p.status === 'paid'
                        ? 'var(--ct-accent-soft)'
                        : p.status === 'processing'
                          ? '#fff3cd'
                          : 'var(--ct-surface-soft)',
                    color:
                      p.status === 'paid'
                        ? 'var(--ct-neon-dark)'
                        : p.status === 'processing'
                          ? '#664d03'
                          : 'var(--ct-text-muted)',
                  }}
                >
                  {p.status}
                </span>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}
