import type { ProgramExercise } from '@/services/types';

interface ProgramExerciseRowProps {
  exercise: ProgramExercise;
  index: number;
  total: number;
  onChange: (updated: ProgramExercise) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function ProgramExerciseRow({
  exercise,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ProgramExerciseRowProps) {
  return (
    <div className="ct-exercise-row">
      <span className="ct-exercise-row-num">{index + 1}</span>
      <div className="ct-exercise-row-name-wrap">
        <input
          className="ct-exercise-row-name"
          value={exercise.name}
          onChange={(e) => onChange({ ...exercise, name: e.target.value })}
          placeholder="Exercise name"
        />
      </div>
      <input
        className="ct-exercise-row-field"
        type="number"
        min={1}
        value={exercise.sets}
        onChange={(e) => onChange({ ...exercise, sets: Number(e.target.value) || 1 })}
        title="Sets"
      />
      <input
        className="ct-exercise-row-field"
        value={exercise.reps}
        onChange={(e) => onChange({ ...exercise, reps: e.target.value })}
        placeholder="Reps"
        title="Reps"
      />
      <input
        className="ct-exercise-row-field ct-exercise-row-rest"
        value={exercise.rest}
        onChange={(e) => onChange({ ...exercise, rest: e.target.value })}
        placeholder="Rest"
        title="Rest"
      />
      <div className="ct-exercise-row-actions">
        <button type="button" className="ct-btn-icon ct-press" onClick={onMoveUp} disabled={index === 0} title="Move up">
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 2v8M3 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button type="button" className="ct-btn-icon ct-press" onClick={onMoveDown} disabled={index === total - 1} title="Move down">
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 10V2M3 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button type="button" className="ct-btn-icon ct-btn-icon-danger ct-press" onClick={onRemove} title="Remove">
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  );
}
