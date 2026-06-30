import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Avatar, Panel, SectionDivider } from '@/components/ui';
import { IconChevLeft, IconEdit, IconLogout, IconMessage, IconSend, IconWallet } from '@/components/icons';
import { ClientPaymentSection } from '@/features/coach/clients/ClientPaymentSection';
import { ArchiveClientDialog } from '@/features/coach/clients/ArchiveClientDialog';
import { useCoachConsole, useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import { clientsService, messagesService } from '@/services/api';
import { whatsappContactLabel, whatsappDeepLink } from '@/utils/whatsapp';
import { monthlyPaymentLabel, monthlyPaymentPillClass, paymentReminderText } from '@/utils/coachUi';
import type { ActivityPoint, ActivityRange, Client, ClientPaymentRecord, SessionHistoryItem } from '@/services/types';

const RANGES: { value: ActivityRange; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: '6mo', label: '6 months' },
];

function ActivityChart({ data }: { data: ActivityPoint[] }) {
  const maxSteps = Math.max(...data.map((d) => d.steps), 1);
  const barMaxPx = 100;
  return (
    <div className="ct-activity-chart">
      {data.map((point) => (
        <div key={point.label} className="ct-activity-bar-wrap">
          <div className="ct-activity-bar-area">
            <div
              className="ct-activity-bar"
              style={{ height: `${Math.max(8, (point.steps / maxSteps) * barMaxPx)}px` }}
              title={`${point.steps} steps`}
            />
          </div>
          <div className="ct-activity-bar-label">{point.label}</div>
        </div>
      ))}
    </div>
  );
}

export function CoachClientDetailPage() {
  const { basePath } = useCoachConsole();
  const { clientId = '' } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [payeeName, setPayeeName] = useState('');
  const [payments, setPayments] = useState<ClientPaymentRecord[]>([]);
  const [range, setRange] = useState<ActivityRange>('7d');
  const [activity, setActivity] = useState<ActivityPoint[]>([]);
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [coachNoteDraft, setCoachNoteDraft] = useState('');
  const [notesOpen, setNotesOpen] = useState(false);
  const [actionNote, setActionNote] = useState<string | null>(null);
  const [sendingAction, setSendingAction] = useState<'remind' | 'note' | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [checkIns, setCheckIns] = useState<Awaited<ReturnType<typeof clientsService.clientSessionLogs>>>([]);

  useCoachConsoleLoading(!client);

  useEffect(() => {
    clientsService.get(clientId).then((row) => {
      if (!row) {
        setClient(null);
        return;
      }
      setClient(row);
      void clientsService.payeeName(row).then(setPayeeName);
    });
    clientsService.sessionHistory(clientId).then(setHistory);
    clientsService.paymentHistory(clientId).then(setPayments);
    clientsService.clientSessionLogs(clientId).then(setCheckIns);
  }, [clientId]);

  useEffect(() => {
    clientsService.activity(clientId, range).then(setActivity);
  }, [clientId, range]);

  const openWhatsApp = () => {
    const phone = client?.phone ?? '';
    if (!phone) {
      setActionNote('No WhatsApp number on file for this client.');
      return;
    }
    const url = whatsappDeepLink(phone, whatsappContactLabel(client?.name ?? 'there'));
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const sendClientMessage = async (
    text: string,
    successLabel: string,
    action: 'remind' | 'note',
  ) => {
    setSendingAction(action);
    setActionNote(null);
    try {
      const thread = await messagesService.threadForClient(clientId);
      if (!thread) {
        setActionNote('No message thread for this client yet.');
        return;
      }
      await messagesService.send(thread.id, text);
      setActionNote(successLabel);
      if (action === 'note') {
        setCoachNoteDraft('');
        setNotesOpen(false);
      }
    } finally {
      setSendingAction(null);
    }
  };

  if (!client) {
    return (
      <Panel>
        <div className="ct-panel-body" style={{ textAlign: 'center', color: 'var(--ct-text-muted)' }}>
          Client not found.
        </div>
      </Panel>
    );
  }

  return (
    <div className="ct-page" style={{ maxWidth: 860 }}>
      <div className="ct-client-detail-head">
        <button
          type="button"
          className="ct-press ct-client-detail-back"
          onClick={() => navigate(`${basePath}/clients`)}
          aria-label="Back to clients"
        >
          <IconChevLeft size={18} />
        </button>
        <Avatar initials={client.initials} tint={client.tint} size={62} />
        <div className="ct-client-detail-head-copy">
          <div style={{ fontSize: 18, fontWeight: 600 }}>{client.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ct-text-muted)', marginTop: 4 }}>
            {client.timezone} · {client.tenure} · {client.age} yrs
          </div>
          <div style={{ fontSize: 12, color: 'var(--ct-text-muted)', marginTop: 4 }}>
            Member since {client.joined}
          </div>
        </div>
        {client.status === 'active' ? (
          <button
            type="button"
            className="ct-btn-secondary ct-press ct-client-program-btn ct-client-detail-head-action"
            disabled={archiving}
            onClick={() => setArchiveOpen(true)}
          >
            <IconLogout size={16} />
            Archive client
          </button>
        ) : (
          <span className="ct-pill ct-pill-replied ct-client-detail-head-action">Archived client</span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
        {[
          { v: client.streak, l: 'Day streak' },
          { v: `${client.programCompletion}%`, l: 'Program completion' },
          { v: history.length, l: 'Sessions' },
        ].map((stat) => (
          <Panel key={stat.l}>
            <div className="ct-panel-body" style={{ padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 600 }}>{stat.v}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{stat.l}</div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel style={{ marginBottom: 14 }}>
        <div className="ct-panel-body">
          <div className="ct-client-program-row">
            <div className="ct-client-program-info">
              <div className="ct-client-program-copy">
                <div className="ct-client-program-label">Current program</div>
                <div className="ct-client-program-name">{client.program}</div>
              </div>
              <span className={monthlyPaymentPillClass(client.monthlyPayment)}>
                {monthlyPaymentLabel(client.monthlyPayment)} this month
              </span>
            </div>
            <div className="ct-client-program-actions">
              {client.monthlyPayment === 'unpaid' ? (
                <button
                  type="button"
                  className="ct-btn-secondary ct-press ct-client-program-btn is-remind"
                  disabled={sendingAction === 'remind'}
                  onClick={() => void sendClientMessage(paymentReminderText(client.name), 'Payment reminder sent.', 'remind')}
                >
                  <IconWallet size={16} />
                  {sendingAction === 'remind' ? 'Sending…' : 'Remind payment'}
                </button>
              ) : null}
              <button type="button" className="ct-btn-secondary ct-press ct-client-program-btn" onClick={openWhatsApp}>
                <IconMessage size={16} />
                WhatsApp
              </button>
              <button
                type="button"
                className={`ct-btn-secondary ct-press ct-client-program-btn${notesOpen ? ' is-active' : ''}`}
                onClick={() => {
                  setNotesOpen((open) => !open);
                  setActionNote(null);
                }}
              >
                <IconEdit size={16} />
                Notes
              </button>
            </div>
          </div>

          {actionNote ? <div className="ct-client-action-note">{actionNote}</div> : null}

          {notesOpen ? (
            <div className="ct-client-notes-compose">
              <textarea
                className="ct-client-notes-input"
                rows={3}
                value={coachNoteDraft}
                onChange={(e) => setCoachNoteDraft(e.target.value)}
                placeholder={`Write a note to ${client.name.split(/\s+/)[0] ?? client.name}…`}
              />
              <div className="ct-client-notes-actions">
                <button
                  type="button"
                  className="ct-btn-primary ct-press ct-client-program-btn"
                  disabled={!coachNoteDraft.trim() || sendingAction === 'note'}
                  onClick={() =>
                    void sendClientMessage(coachNoteDraft.trim(), 'Note sent as a message.', 'note')
                  }
                >
                  <IconSend size={16} />
                  {sendingAction === 'note' ? 'Sending…' : 'Send as message'}
                </button>
                <button
                  type="button"
                  className="ct-btn-secondary ct-press ct-client-program-btn"
                  onClick={() => {
                    setNotesOpen(false);
                    setCoachNoteDraft('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </Panel>

      <ClientPaymentSection client={client} payeeName={payeeName} payments={payments} />

      <SectionDivider title="Recent check-ins" />
      <Panel style={{ marginBottom: 18 }}>
        <div className="ct-panel-body">
          {checkIns.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--ct-text-muted)' }}>No check-ins logged yet.</p>
          ) : (
            checkIns.slice(0, 5).map((log) => (
              <Link
                key={log.id}
                to={`${basePath}/clients/${clientId}/check-ins/${log.id}`}
                className="ct-press"
                style={{
                  display: 'block',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--ct-divider)',
                  color: 'inherit',
                  fontSize: 13,
                }}
              >
                <div style={{ fontWeight: 600 }}>{log.title}</div>
                <div style={{ color: 'var(--ct-text-muted)', marginTop: 2 }}>
                  {log.date} · {log.durationMinutes} min · {log.weightKg} kg
                </div>
              </Link>
            ))
          )}
        </div>
      </Panel>

      <SectionDivider title="Activity" />
      <Panel style={{ marginBottom: 18 }}>
        <div className="ct-panel-body">
          <div className="ct-activity-header">
            <span className="ct-activity-title">Physical activity</span>
            <select
              className="ct-activity-range-select"
              value={range}
              onChange={(e) => setRange(e.target.value as ActivityRange)}
            >
              {RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <ActivityChart data={activity} />
        </div>
      </Panel>

      <SectionDivider title="Session history" />
      <Panel>
        <div className="ct-panel-body ct-session-history-panel">
          {history.map((session, i) => (
            <div key={session.id} className={`ct-session-history-item${i ? ' has-border' : ''}`}>
              <div className="ct-session-history-head">
                <div className="ct-session-history-copy">
                  <div className="ct-session-history-title">{session.title}</div>
                  <div className="ct-session-history-meta">
                    {session.date} · {session.duration} · {session.exerciseCount} exercises
                  </div>
                </div>
                <button
                  type="button"
                  className="ct-press ct-session-history-edit"
                  onClick={() => {
                    setEditingId(session.id);
                    setNoteDraft(session.note ?? '');
                  }}
                >
                  Edit note
                </button>
              </div>
              {editingId === session.id ? (
                <div className="ct-session-history-compose">
                  <textarea
                    className="ct-session-history-input"
                    rows={3}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                  />
                  <div className="ct-session-history-compose-actions">
                    <button
                      type="button"
                      className="ct-btn-primary ct-press ct-client-program-btn"
                      onClick={async () => {
                        const updated = await clientsService.updateSessionNote(session.id, noteDraft);
                        setHistory((rows) => rows.map((r) => (r.id === updated.id ? updated : r)));
                        setEditingId(null);
                      }}
                    >
                      Save note
                    </button>
                    <button type="button" className="ct-btn-secondary ct-press ct-client-program-btn" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : session.note ? (
                <p className="ct-session-history-note">{session.note}</p>
              ) : (
                <p className="ct-session-history-note is-empty">No coach note yet.</p>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <ArchiveClientDialog
        open={archiveOpen}
        clientName={client.name}
        onClose={() => setArchiveOpen(false)}
        onConfirm={async (reason) => {
          setArchiving(true);
          try {
            await clientsService.archive(client.id, reason);
            navigate(`${basePath}/clients`);
          } finally {
            setArchiving(false);
          }
        }}
      />
    </div>
  );
}
