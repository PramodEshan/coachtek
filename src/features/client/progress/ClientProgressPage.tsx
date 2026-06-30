import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { ClientProgressWidget } from '@/features/client/dashboard/ClientProgressWidget';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { clientService } from '@/services/api';
import type { BodyMetricEntry, ClientProgressSummary, SessionCompletionLog } from '@/services/types';
import { sessionFeelingEmoji, sessionFeelingLabel } from '@/utils/clientUi';

export function ClientProgressPage() {
  const [progress, setProgress] = useState<ClientProgressSummary | null>(null);
  const [metrics, setMetrics] = useState<BodyMetricEntry[]>([]);
  const [sessions, setSessions] = useState<SessionCompletionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('client-main', loading);

  useEffect(() => {
    Promise.all([clientService.progressSummary(), clientService.bodyMetrics(), clientService.sessionLogs()])
      .then(([summary, m, logs]) => {
        setProgress(summary);
        setMetrics(m);
        setSessions(logs);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!progress) return null;

  return (
    <div className="ct-page">
      <ClientProgressWidget summary={progress} compact />

      <Panel style={{ marginTop: 14 }}>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Weight trend</div>
          <div className="ct-activity-chart">
            {metrics.map((m) => (
              <div key={m.date} className="ct-activity-bar-wrap">
                <div className="ct-activity-bar-area">
                  <div className="ct-activity-bar" style={{ height: `${((m.weight / 85) * 80)}px` }} />
                </div>
                <div className="ct-activity-bar-label">{m.date.slice(8)}</div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel style={{ marginTop: 14, overflow: 'hidden' }}>
        <div className="ct-panel-body" style={{ paddingBottom: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Session history</div>
        </div>
        {sessions.map((session, index) => (
          <Link
            key={session.id}
            to={`/client/sessions/${session.id}`}
            className="ct-press"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 18px',
              borderTop: index ? '1px solid var(--ct-divider)' : undefined,
              fontSize: 13,
              color: 'inherit',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>{session.title}</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)', marginTop: 2 }}>
                {session.date} · {session.durationMinutes} min · {session.caloriesBurned} kcal · {session.weightKg} kg ·{' '}
                {sessionFeelingLabel(session.feeling)}
              </div>
              {session.comment ? (
                <div style={{ fontSize: 12, color: 'var(--ct-text-body)', marginTop: 4 }}>{session.comment}</div>
              ) : null}
            </div>
            <span className="ct-client-progress-feeling" title={sessionFeelingLabel(session.feeling)}>
              {sessionFeelingEmoji(session.feeling)}
            </span>
          </Link>
        ))}
      </Panel>

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <Link to="/client/progress/metrics" className="ct-btn-secondary ct-press">Body metrics</Link>
        <Link to="/client/progress/photos" className="ct-btn-secondary ct-press">Progress photos</Link>
      </div>
    </div>
  );
}

export function ClientProgressMetricsPage() {
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useRolePageLoading('client-main');

  useEffect(() => {
    clientService.bodyMetrics().then((rows) => {
      const latest = rows.at(-1);
      if (latest) {
        setWeight(String(latest.weight));
        setWaist(latest.waist != null ? String(latest.waist) : '');
        setChest(latest.chest != null ? String(latest.chest) : '');
      }
    });
  }, []);

  async function handleSave() {
    const w = Number(weight);
    if (!w || w <= 0) return;
    setSaving(true);
    try {
      await clientService.saveBodyMetric({
        date: new Date().toISOString().slice(0, 10),
        weight: w,
        waist: waist ? Number(waist) : undefined,
        chest: chest ? Number(chest) : undefined,
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ct-page">
      <Panel>
        <div className="ct-panel-body ct-field">
          <label>Weight (kg)</label>
          <input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" step="0.1" />
          <label style={{ marginTop: 12 }}>Waist (cm)</label>
          <input value={waist} onChange={(e) => setWaist(e.target.value)} type="number" />
          <label style={{ marginTop: 12 }}>Chest (cm)</label>
          <input value={chest} onChange={(e) => setChest(e.target.value)} type="number" />
          {saved ? (
            <p style={{ fontSize: 13, color: 'var(--ct-neon-dark)', marginTop: 12 }}>Entry saved.</p>
          ) : null}
          <button type="button" className="ct-btn-primary ct-press" style={{ marginTop: 16 }} disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save entry'}
          </button>
        </div>
      </Panel>
    </div>
  );
}

export function ClientProgressPhotosPage() {
  const [photos, setPhotos] = useState<Awaited<ReturnType<typeof clientService.progressPhotos>>>([]);
  const [uploading, setUploading] = useState(false);

  useRolePageLoading('client-main');

  useEffect(() => {
    clientService.progressPhotos().then(setPhotos);
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const photo = await clientService.uploadProgressPhoto(dataUrl);
      setPhotos((rows) => [photo, ...rows]);
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <div className="ct-page">
      <Panel>
        <div className="ct-panel-body">
          <p style={{ color: 'var(--ct-text-muted)', marginBottom: 12 }}>
            Upload progress photos to track visual changes over time.
          </p>
          <label className="ct-btn-secondary ct-press" style={{ display: 'inline-block', cursor: 'pointer' }}>
            {uploading ? 'Uploading…' : 'Upload photo'}
            <input type="file" accept="image/*" hidden onChange={handleFileSelect} disabled={uploading} />
          </label>
          {photos.length === 0 ? (
            <p style={{ marginTop: 16, fontSize: 13, color: 'var(--ct-text-muted)' }}>No photos yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginTop: 16 }}>
              {photos.map((photo) => (
                <figure key={photo.id}>
                  <img
                    src={photo.dataUrl}
                    alt={`Progress ${photo.date}`}
                    style={{ width: '100%', borderRadius: 'var(--ct-radius-sm)', aspectRatio: '3/4', objectFit: 'cover' }}
                  />
                  <figcaption style={{ fontSize: 11, color: 'var(--ct-text-muted)', marginTop: 4 }}>{photo.date}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
