import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { clientService } from '@/services/api';
import type { SessionCompletionLog } from '@/services/types';
import { sessionFeelingEmoji, sessionFeelingLabel } from '@/utils/clientUi';

export function ClientSessionDetailPage() {
  const { sessionId = '' } = useParams();
  const [session, setSession] = useState<SessionCompletionLog | null>(null);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('client-main', loading);

  useEffect(() => {
    clientService.sessionById(sessionId).then(setSession).finally(() => setLoading(false));
  }, [sessionId]);

  if (!session) {
    return (
      <div className="ct-page" style={{ maxWidth: 640 }}>
        <Panel>
          <div className="ct-panel-body">
            <p style={{ color: 'var(--ct-text-muted)' }}>Session not found.</p>
            <Link to="/client/progress" className="ct-btn-secondary ct-press" style={{ marginTop: 12, display: 'inline-block' }}>
              Back to progress
            </Link>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="ct-page" style={{ maxWidth: 640 }}>
      <Panel>
        <div className="ct-panel-body">
          <h2 style={{ fontWeight: 700 }}>{session.title}</h2>
          <p style={{ color: 'var(--ct-text-muted)', marginTop: 4 }}>
            {session.date} · {session.durationMinutes} min · {session.caloriesBurned} kcal · {session.weightKg} kg ·{' '}
            {sessionFeelingLabel(session.feeling)} {sessionFeelingEmoji(session.feeling)}
          </p>
          {session.comment ? (
            <p style={{ marginTop: 12, lineHeight: 1.5, fontSize: 14 }}>{session.comment}</p>
          ) : null}
          {session.coachNote ? (
            <>
              <div style={{ marginTop: 16, fontWeight: 600 }}>Coach notes</div>
              <p
                style={{
                  marginTop: 8,
                  lineHeight: 1.5,
                  fontSize: 14,
                  background: 'var(--ct-surface-soft)',
                  padding: 12,
                  borderRadius: 'var(--ct-radius-sm)',
                }}
              >
                {session.coachNote}
              </p>
            </>
          ) : null}
          {session.exerciseLogs && session.exerciseLogs.length > 0 ? (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Exercise log</div>
              {session.exerciseLogs.map((ex) => (
                <div key={ex.exerciseId} style={{ padding: '10px 0', borderBottom: '1px solid var(--ct-divider)', fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>{ex.name}</div>
                  <div style={{ color: 'var(--ct-text-muted)', marginTop: 2 }}>
                    {ex.reps ? `${ex.reps} reps` : ''}
                    {ex.weightKg ? ` · ${ex.weightKg} kg` : ''}
                    {ex.time && ex.time !== '—' ? ` · ${ex.time}` : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <Link to="/client/progress" className="ct-btn-secondary ct-press" style={{ marginTop: 16, display: 'inline-block' }}>
            Back to progress
          </Link>
        </div>
      </Panel>
    </div>
  );
}
