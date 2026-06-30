import { useEffect, useState } from 'react';
import { Panel } from '@/components/ui';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { clientService, coachService } from '@/services/api';
import { whatsappContactLabel, whatsappDeepLink } from '@/utils/whatsapp';

export function ClientMessagesPage() {
  const [coachName, setCoachName] = useState('');
  const [coachWhatsapp, setCoachWhatsapp] = useState('');
  const [clientOptIn, setClientOptIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('client-main', loading);

  useEffect(() => {
    Promise.all([clientService.profile(), coachService.profile()])
      .then(([client, coach]) => {
        setCoachName(client.coachName);
        setCoachWhatsapp(coach.whatsappBusinessNumber ?? '');
        setClientOptIn(client.whatsappOptIn ?? false);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page ct-page-messages" style={{ maxWidth: 560 }}>
      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Contact your coach</div>
          <p style={{ fontSize: 14, color: 'var(--ct-text-body)', lineHeight: 1.5 }}>
            Coaching conversations happen on WhatsApp. Tap below to message {coachName || 'your coach'} directly.
          </p>
          {coachWhatsapp && clientOptIn ? (
            <a
              href={whatsappDeepLink(coachWhatsapp, whatsappContactLabel(coachName))}
              target="_blank"
              rel="noopener noreferrer"
              className="ct-btn-primary ct-press"
              style={{ marginTop: 16, display: 'inline-flex' }}
            >
              Open WhatsApp chat
            </a>
          ) : (
            <p style={{ marginTop: 16, fontSize: 13, color: 'var(--ct-text-muted)' }}>
              {!clientOptIn
                ? 'Enable WhatsApp contact in Settings to message your coach.'
                : 'Your coach has not added a WhatsApp number yet.'}
            </p>
          )}
        </div>
      </Panel>
    </div>
  );
}
