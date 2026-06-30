import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel } from '@/components/ui';
import { useRolePageLoading } from '@/context/PageLoadingContext';
import { clientService } from '@/services/api';
import type { ClientProfile, ClientWorkout, ExerciseLogEntry, SessionFeeling } from '@/services/types';
import { clearDraft, loadDraft, saveDraft } from '@/utils/draftStorage';
import { SESSION_FEELING_OPTIONS } from '@/utils/clientUi';

const DRAFT_KEY = 'client-workout-log';

interface WorkoutDraft {
  durationMinutes: string;
  caloriesBurned: string;
  weightKg: string;
  feeling: SessionFeeling;
  comment: string;
  exerciseLogs: ExerciseLogEntry[];
}

export function ClientWorkoutLogPage() {
  useRolePageLoading('client-main');
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<ClientWorkout | null>(null);
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [durationMinutes, setDurationMinutes] = useState('55');
  const [caloriesBurned, setCaloriesBurned] = useState('350');
  const [weightKg, setWeightKg] = useState('');
  const [feeling, setFeeling] = useState<SessionFeeling>('good');
  const [comment, setComment] = useState('');
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([clientService.todayWorkout(), clientService.profile()]).then(([w, p]) => {
      setWorkout(w);
      setProfile(p);
      const draft = loadDraft<WorkoutDraft>(DRAFT_KEY);
      if (draft) {
        setDurationMinutes(draft.durationMinutes);
        setCaloriesBurned(draft.caloriesBurned);
        setWeightKg(draft.weightKg);
        setFeeling(draft.feeling);
        setComment(draft.comment);
        setExerciseLogs(draft.exerciseLogs);
      } else {
        setWeightKg(String(p.weight ?? 78));
        setExerciseLogs(
          w.exercises.map((ex) => ({
            exerciseId: ex.id,
            name: ex.name,
            reps: ex.reps,
            weightKg: '',
            time: '—',
          })),
        );
      }
    });
  }, []);

  useEffect(() => {
    if (!workout) return;
    saveDraft(DRAFT_KEY, {
      durationMinutes,
      caloriesBurned,
      weightKg,
      feeling,
      comment,
      exerciseLogs,
    });
  }, [workout, durationMinutes, caloriesBurned, weightKg, feeling, comment, exerciseLogs]);

  function updateExercise(index: number, patch: Partial<ExerciseLogEntry>) {
    setExerciseLogs((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  async function handleComplete() {
    const duration = Number(durationMinutes);
    const calories = Number(caloriesBurned);
    const weight = Number(weightKg);

    if (!duration || duration <= 0) {
      setError('Enter session time in minutes.');
      return;
    }
    if (!calories || calories <= 0) {
      setError('Enter calories burned.');
      return;
    }
    if (!weight || weight <= 0) {
      setError('Enter your weight after the session.');
      return;
    }

    setError('');
    setSaving(true);
    try {
      await clientService.completeWorkout({
        durationMinutes: duration,
        caloriesBurned: calories,
        weightKg: weight,
        feeling,
        comment,
        exerciseLogs,
      });
      clearDraft(DRAFT_KEY);
      navigate('/client/dashboard');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ct-page">
      <Panel style={{ marginBottom: 14 }}>
        <div className="ct-panel-body">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>After session check-in</h2>
          <p style={{ fontSize: 13, color: 'var(--ct-text-muted)', lineHeight: 1.45 }}>
            Record how the session went. This updates your progress and participation on the dashboard.
          </p>
        </div>
      </Panel>

      <Panel style={{ marginBottom: 14 }}>
        <div className="ct-panel-body">
          <div className="ct-field" style={{ marginBottom: 14 }}>
            <label>Session time (minutes)</label>
            <input
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="e.g. 55"
            />
          </div>
          <div className="ct-field" style={{ marginBottom: 14 }}>
            <label>Calories burned</label>
            <input
              type="number"
              min={1}
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
              placeholder="e.g. 350"
            />
          </div>
          <div className="ct-field" style={{ marginBottom: 14 }}>
            <label>Weight after session (kg)</label>
            <input
              type="number"
              min={1}
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="e.g. 78.0"
            />
          </div>
          <div className="ct-field">
            <label>How did it feel?</label>
            <div className="ct-client-feeling-row">
              {SESSION_FEELING_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`ct-filter-pill ct-press${feeling === option.value ? ' active' : ''}`}
                  onClick={() => setFeeling(option.value)}
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="ct-panel-body">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Exercise log</h3>
          {exerciseLogs.map((entry, index) => (
            <div key={entry.exerciseId} className="ct-field" style={{ marginBottom: 12 }}>
              <label>{entry.name}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <input
                  placeholder="Reps"
                  value={entry.reps ?? ''}
                  onChange={(e) => updateExercise(index, { reps: e.target.value })}
                />
                <input
                  placeholder="Weight kg"
                  value={entry.weightKg ?? ''}
                  onChange={(e) => updateExercise(index, { weightKg: e.target.value })}
                />
                <input
                  placeholder="Time"
                  value={entry.time ?? ''}
                  onChange={(e) => updateExercise(index, { time: e.target.value })}
                />
              </div>
            </div>
          ))}
          {!profile && exerciseLogs.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--ct-text-muted)' }}>Loading exercises…</p>
          ) : null}
          <div className="ct-field">
            <label>Session comment (optional)</label>
            <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          {error ? (
            <p style={{ color: 'var(--ct-danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>
          ) : null}
          <button
            type="button"
            className="ct-btn-primary ct-press"
            disabled={saving}
            onClick={handleComplete}
          >
            {saving ? 'Saving…' : 'Complete workout'}
          </button>
        </div>
      </Panel>
    </div>
  );
}
