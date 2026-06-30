import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Avatar, Panel, SearchBar } from '@/components/ui';
import { useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import { clientsService, coachService } from '@/services/api';
import type { Client } from '@/services/types';
import { whatsappContactLabel, whatsappDeepLink } from '@/utils/whatsapp';

export function CoachMessagesPage() {
  const [searchParams] = useSearchParams();
  const clientIdParam = searchParams.get('client');
  const [clients, setClients] = useState<Client[]>([]);
  const [coachWhatsapp, setCoachWhatsapp] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useCoachConsoleLoading(loading);

  useEffect(() => {
    Promise.all([clientsService.list({ status: 'active' }), coachService.profile()])
      .then(([rows, profile]) => {
        setClients(rows);
        setCoachWhatsapp(profile.whatsappBusinessNumber ?? '');
        if (clientIdParam) {
          setActiveId(clientIdParam);
        } else if (rows[0]) {
          setActiveId(rows[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, [clientIdParam]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(q));
  }, [clients, search]);

  const active = clients.find((c) => c.id === activeId);

  return (
    <div className="ct-page ct-page-wide ct-page-messages">
      <Panel style={{ marginBottom: 14 }}>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>WhatsApp contact</div>
          <p style={{ fontSize: 13, color: 'var(--ct-text-muted)', lineHeight: 1.45 }}>
            Client messaging happens on WhatsApp. Open a chat with your business number shared on your profile.
          </p>
          {coachWhatsapp ? (
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Your WhatsApp: <strong>{coachWhatsapp}</strong>
            </p>
          ) : (
            <p style={{ fontSize: 13, marginTop: 8, color: 'var(--ct-text-muted)' }}>
              Add your WhatsApp business number in Profile settings.
            </p>
          )}
        </div>
      </Panel>

      <div className="ct-messages-search-row">
        <SearchBar placeholder="Search clients" value={search} onChange={setSearch} />
      </div>

      <div className="ct-messages-layout">
        <Panel className="ct-messages-list-panel">
          <div className="ct-messages-list-body ct-scroll">
            {filtered.length === 0 ? (
              <div className="ct-messages-list-empty">
                <p>No clients match your search.</p>
              </div>
            ) : (
              filtered.map((client, i) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => setActiveId(client.id)}
                  className={`ct-messages-thread-row ct-row${activeId === client.id ? ' is-active' : ''}${i === 0 ? ' is-first' : ''}`}
                >
                  <Avatar initials={client.initials} tint={client.tint} size={50} shape="round" />
                  <div className="ct-messages-thread-copy">
                    <div className="ct-messages-thread-name">{client.name}</div>
                    <div className="ct-messages-thread-preview">
                      {client.phone ? client.phone : 'No phone on file'}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Panel>

        {active ? (
          <Panel className="ct-messages-thread-panel">
            <div className="ct-panel-body">
              <div style={{ fontWeight: 700, fontSize: 16 }}>{active.name}</div>
              <p style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginTop: 6 }}>
                Program: {active.program}
              </p>
              {active.phone ? (
                <a
                  href={whatsappDeepLink(active.phone, whatsappContactLabel(active.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ct-btn-primary ct-press"
                  style={{ marginTop: 16, display: 'inline-flex' }}
                >
                  Open WhatsApp chat
                </a>
              ) : (
                <p style={{ marginTop: 16, fontSize: 13, color: 'var(--ct-text-muted)' }}>
                  Ask this client to add their WhatsApp number in profile settings.
                </p>
              )}
            </div>
          </Panel>
        ) : (
          <Panel className="ct-messages-thread-panel ct-messages-thread-empty">
            <div className="ct-messages-thread-placeholder">Select a client to contact on WhatsApp.</div>
          </Panel>
        )}
      </div>
    </div>
  );
}
