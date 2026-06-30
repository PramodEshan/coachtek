import { Panel } from '@/components/ui';
import {
  clientMembershipLabel,
  clientPayeeFeeLabel,
  clientPayeeSummary,
  monthlyPaymentLabel,
  monthlyPaymentPillClass,
  paymentRecordStatusClass,
} from '@/utils/coachUi';
import type { Client, ClientPaymentRecord } from '@/services/types';

interface ClientPaymentSectionProps {
  client: Client;
  payeeName: string;
  payments: ClientPaymentRecord[];
}

export function ClientPaymentSection({ client, payeeName, payments }: ClientPaymentSectionProps) {
  return (
    <>
      <Panel style={{ marginBottom: 14 }}>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Payment</div>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
              <span style={{ color: 'var(--ct-text-muted)' }}>Membership</span>
              <span style={{ fontWeight: 600 }}>{clientMembershipLabel(client.membership)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
              <span style={{ color: 'var(--ct-text-muted)' }}>Fee type</span>
              <span style={{ fontWeight: 600 }}>{clientPayeeFeeLabel(client.membership)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
              <span style={{ color: 'var(--ct-text-muted)' }}>Payee</span>
              <span style={{ fontWeight: 600 }}>{payeeName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, alignItems: 'center' }}>
              <span style={{ color: 'var(--ct-text-muted)' }}>This month</span>
              <span className={monthlyPaymentPillClass(client.monthlyPayment)}>
                {monthlyPaymentLabel(client.monthlyPayment)}
              </span>
            </div>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--ct-text-muted)', marginTop: 14, lineHeight: 1.45 }}>
            {clientPayeeSummary(client, payeeName)}
          </p>
        </div>
      </Panel>

      <Panel style={{ marginBottom: 18 }}>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Payment history</div>
          {payments.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--ct-text-muted)' }}>No payment records yet.</p>
          ) : (
            payments.map((payment, index) => (
              <div
                key={payment.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderTop: index ? '1px solid var(--ct-divider)' : undefined,
                  fontSize: 13,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>
                    {payment.payeeType === 'gym' ? 'Gym fee' : 'Coach fee'} · {payment.payeeName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ct-text-muted)', marginTop: 2 }}>{payment.date}</div>
                </div>
                <div style={{ fontWeight: 700 }}>£{payment.amount}</div>
                <span className={paymentRecordStatusClass(payment.status)}>{payment.status}</span>
              </div>
            ))
          )}
        </div>
      </Panel>
    </>
  );
}
