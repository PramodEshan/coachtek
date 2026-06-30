import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Avatar, Panel, PanelHeader, SearchBar } from '@/components/ui';
import { IconLink } from '@/components/icons';
import { CALENDAR_MONTH, CALENDAR_YEAR } from '@/features/coach/calendar/calendarUtils';
import { useCoachConsole, useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import { clientsService } from '@/services/api';
import { monthlyPaymentLabel, monthlyPaymentPillClass } from '@/utils/coachUi';
import type { Client, ClientStatus } from '@/services/types';

const FILTERS: { label: string; status?: ClientStatus }[] = [
  { label: 'All active', status: 'active' },
  { label: 'Unpaid this month' },
  { label: 'Archived', status: 'archived' },
];

const UNPAID_FILTER = FILTERS.find((f) => f.label === 'Unpaid this month') ?? FILTERS[0];

export function CoachClientsPage() {
  const { basePath, variant } = useCoachConsole();
  const [searchParams] = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [payeeLabels, setPayeeLabels] = useState<Record<string, { payeeName: string; feeLabel: string }>>({});
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(() =>
    searchParams.get('filter') === 'unpaid' ? UNPAID_FILTER : FILTERS[0],
  );
  const [loading, setLoading] = useState(true);

  const paymentMonthLabel = useMemo(
    () =>
      new Date(CALENDAR_YEAR, CALENDAR_MONTH - 1, 1).toLocaleString('en-US', { month: 'long' }),
    [],
  );

  useCoachConsoleLoading(loading);

  useEffect(() => {
    if (searchParams.get('filter') === 'unpaid') {
      setFilter(UNPAID_FILTER);
    }
  }, [searchParams]);

  useEffect(() => {
    clientsService.payeeLabels().then(setPayeeLabels);
  }, []);

  useEffect(() => {
    setLoading(true);
    clientsService
      .list({
        status: filter.status,
        query: query || undefined,
      })
      .then((rows) => {
        const scoped = rows.filter((client) =>
          variant === 'gym' ? client.membership === 'gym' : client.membership !== 'gym',
        );
        if (filter.label === 'Unpaid this month') {
          setClients(scoped.filter((c) => c.monthlyPayment === 'unpaid'));
        } else {
          setClients(scoped);
        }
      })
      .finally(() => setLoading(false));
  }, [query, filter, variant]);

  return (
    <div className="ct-page">
      <SearchBar placeholder="Search clients" value={query} onChange={setQuery} />
      <div className="ct-filter-row ct-scroll">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            className={`ct-filter-pill ct-press${filter.label === f.label ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Panel className="ct-clients-panel">
        <PanelHeader
          title="Active roster"
          action={
            <Link to={`${basePath}/invites`} className="ct-btn-primary ct-press ct-clients-invite-link">
              <IconLink size={16} />
              Get invite link
            </Link>
          }
        />
        <div className="ct-clients-table">
          <div className="ct-table-head ct-clients-table-head">
            <span>Client</span>
            <span>Program</span>
            <span>Program completion</span>
            <span>{paymentMonthLabel} payment</span>
            <span>Payee</span>
            <span>Streak</span>
          </div>
          {clients.map((client) => {
            const payee = payeeLabels[client.id];
            return (
            <Link
              key={client.id}
              to={`${basePath}/clients/${client.id}`}
              className="ct-row ct-table-row ct-clients-row"
            >
              <div className="ct-clients-row-client">
                <Avatar initials={client.initials} tint={client.tint} />
                <span className="ct-clients-row-name">{client.name}</span>
              </div>
              <span
                className={`ct-clients-row-payment ${monthlyPaymentPillClass(client.monthlyPayment)}`}
              >
                {monthlyPaymentLabel(client.monthlyPayment)}
              </span>
              <span className="ct-clients-row-program">{client.program}</span>
              <div className="ct-clients-row-meta">
                <span className="ct-clients-row-completion">{client.programCompletion}%</span>
                <span className="ct-clients-row-payee">
                  {payee ? `${payee.feeLabel} · ${payee.payeeName}` : '—'}
                </span>
                <span className="ct-clients-row-streak">🔥 {client.streak}</span>
              </div>
            </Link>
          );
          })}
        </div>
      </Panel>
    </div>
  );
}
