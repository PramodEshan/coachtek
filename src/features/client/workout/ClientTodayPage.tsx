import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { clientService } from '@/services/api';
import type { ClientWorkout } from '@/services/types';

export function ClientTodayPage() {
  const [workout, setWorkout] = useState<ClientWorkout | null>(null);
  const [loading, setLoading] = useState(true);

  useRolePageLoading('client-main', loading);

  useEffect(() => {
    clientService.todayWorkout().then(setWorkout).finally(() => setLoading(false));
  }, []);

  if (!workout) return null;

  return (
    <div className="ct-page">
      <Panel>
        <div className="ct-panel-body">
          <div style={{ fontWeight: 700, fontSize: 18 }}>{workout.title}</div>
          <p style={{ color: 'var(--ct-text-muted)', marginTop: 4 }}>{workout.date}</p>
          {workout.coachNote ? (
            <p style={{ marginTop: 12, fontSize: 14, color: 'var(--ct-text-body)', background: 'var(--ct-surface-soft)', padding: 12, borderRadius: 'var(--ct-radius-sm)' }}>
              Coach note: {workout.coachNote}
            </p>
          ) : null}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {workout.exercises.map((ex) => (
              <div key={ex.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--ct-divider)' }}>
                <div style={{ fontWeight: 600 }}>{ex.name}</div>
                <div style={{ fontSize: 13, color: 'var(--ct-text-muted)', marginTop: 2 }}>
                  {ex.sets} sets × {ex.reps} · rest {ex.rest}
                </div>
              </div>
            ))}
          </div>
          {workout.completed ? (
            <div style={{ marginTop: 16 }}>
              <p style={{ color: 'var(--ct-success)', fontWeight: 600 }}>Workout completed</p>
              <Link to="/client/dashboard" className="ct-btn-secondary ct-press" style={{ marginTop: 10, display: 'inline-flex' }}>
                View progress
              </Link>
            </div>
          ) : (
            <Link to="/client/workout/log" className="ct-btn-primary ct-press" style={{ marginTop: 16, display: 'inline-flex' }}>
              Log workout & check-in
            </Link>
          )}
        </div>
      </Panel>
    </div>
  );
}
