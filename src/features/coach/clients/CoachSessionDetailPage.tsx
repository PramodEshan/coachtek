import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { IconChevLeft } from '@/components/icons';
import { useCoachConsole, useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import { clientsService } from '@/services/api';
import type { SessionCompletionLog } from '@/services/types';
import { sessionFeelingEmoji, sessionFeelingLabel } from '@/utils/clientUi';

export function CoachCheckInDetailPage() {
  const { basePath } = useCoachConsole();
  const { clientId = '', logId = '' } = useParams();
  const [log, setLog] = useState<SessionCompletionLog | null>(null);

  useCoachConsoleLoading(!log);

  useEffect(() => {
    clientsService.getSessionLog(logId).then(setLog);
  }, [logId]);

  if (!log) return null;

  return (
    <div className="ct-page" style={{ maxWidth: 720 }}>
      <Link to={`${basePath}/clients/${clientId}`} className="ct-press ct-client-detail-back" style={{ marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <IconChevLeft size={18} /> Back to client
      </Link>
      <Panel>
        <div className="ct-panel-body">
          <h2 style={{ fontWeight: 700 }}>Check-in · {log.title}</h2>
          <p style={{ color: 'var(--ct-text-muted)', marginTop: 4 }}>
            {log.date} · {log.durationMinutes} min · {log.caloriesBurned} kcal · post-session weight {log.weightKg} kg
          </p>
          <p style={{ marginTop: 8 }}>
            Feeling: {sessionFeelingLabel(log.feeling)} {sessionFeelingEmoji(log.feeling)}
          </p>
          {log.comment ? (
            <blockquote style={{ marginTop: 12, padding: 12, background: 'var(--ct-surface-soft)', borderRadius: 'var(--ct-radius-sm)', fontSize: 14 }}>
              {log.comment}
            </blockquote>
          ) : null}
          {log.exerciseLogs && log.exerciseLogs.length > 0 ? (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Logged exercises</div>
              {log.exerciseLogs.map((ex) => (
                <div key={ex.exerciseId} style={{ padding: '8px 0', borderBottom: '1px solid var(--ct-divider)', fontSize: 13 }}>
                  <strong>{ex.name}</strong>
                  <span style={{ color: 'var(--ct-text-muted)', marginLeft: 8 }}>
                    {ex.reps} reps · {ex.weightKg || '—'} kg · {ex.time || '—'}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Panel>
    </div>
  );
}

export function CoachSessionDetailPage() {
  const { basePath } = useCoachConsole();
  const { clientId = '', sessionId = '' } = useParams();
  const [session, setSession] = useState<Awaited<ReturnType<typeof clientsService.getSessionLog>>>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useCoachConsoleLoading(!session);

  useEffect(() => {
    clientsService.getSessionLog(sessionId).then((row) => {
      setSession(row);
      setNote(row?.coachNote ?? '');
    });
  }, [sessionId]);

  if (!session) return null;

  return (
    <div className="ct-page" style={{ maxWidth: 720 }}>
      <Link to={`${basePath}/clients/${clientId}`} className="ct-press ct-client-detail-back" style={{ marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <IconChevLeft size={18} /> Back to client
      </Link>
      <Panel>
        <div className="ct-panel-body">
          <h2 style={{ fontWeight: 700 }}>{session.title}</h2>
          <p style={{ color: 'var(--ct-text-muted)', marginTop: 4 }}>
            {session.date} · {session.durationMinutes} min · {session.exerciseLogs?.length ?? 0} exercises logged
          </p>
          {session.exerciseLogs && session.exerciseLogs.length > 0 ? (
            <div style={{ marginTop: 16 }}>
              {session.exerciseLogs.map((ex) => (
                <div key={ex.exerciseId} style={{ padding: '10px 0', borderBottom: '1px solid var(--ct-divider)' }}>
                  <div style={{ fontWeight: 600 }}>{ex.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--ct-text-muted)' }}>
                    Target vs logged: {ex.reps} reps · {ex.weightKg || '—'} kg
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ marginTop: 12, fontSize: 13, color: 'var(--ct-text-muted)' }}>No per-exercise log for this session.</p>
          )}
          <div className="ct-field" style={{ marginTop: 16 }}>
            <label>Coach note</label>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <button
            type="button"
            className="ct-btn-primary ct-press"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await clientsService.updateSessionLogCoachNote(session.id, note);
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? 'Saving…' : 'Save note'}
          </button>
        </div>
      </Panel>
    </div>
  );
}
