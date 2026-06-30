import { useState } from 'react';
import { EXERCISE_CATALOG, EXERCISE_CATEGORIES, type CatalogExercise } from '@/data/exerciseCatalog';
import type { ProgramExercise } from '@/services/types';

interface ExerciseCatalogPickerProps {
  onSelect: (exercise: ProgramExercise) => void;
  onClose: () => void;
}

export function ExerciseCatalogPicker({ onSelect, onClose }: ExerciseCatalogPickerProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const filtered = EXERCISE_CATALOG.filter((ex) => {
    if (category && ex.category !== category) return false;
    if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function handleSelect(ex: CatalogExercise) {
    onSelect({
      id: `pex-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      catalogId: ex.id,
      name: ex.name,
      sets: ex.defaultSets,
      reps: ex.defaultReps,
      rest: ex.defaultRest,
    });
  }

  function handleCustom() {
    const name = search.trim() || 'Custom exercise';
    onSelect({
      id: `pex-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      sets: 3,
      reps: '10',
      rest: '60s',
    });
  }

  return (
    <div className="ct-catalog-picker">
      <div className="ct-catalog-picker-header">
        <div>
          <h3>Exercise catalog</h3>
          <p>{filtered.length} exercises</p>
        </div>
        <button type="button" className="ct-catalog-close ct-press" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div className="ct-catalog-search-wrap">
        <svg className="ct-catalog-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          className="ct-catalog-search"
          placeholder="Search exercises…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </div>

      <div className="ct-catalog-chips">
        <button
          type="button"
          className={`ct-chip ct-press ${!category ? 'ct-chip-active' : ''}`}
          onClick={() => setCategory(null)}
        >
          All
        </button>
        {EXERCISE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`ct-chip ct-press ${category === cat ? 'ct-chip-active' : ''}`}
            onClick={() => setCategory(cat === category ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <ul className="ct-catalog-list">
        {filtered.map((ex) => (
          <li key={ex.id}>
            <button type="button" className="ct-catalog-row ct-press" onClick={() => handleSelect(ex)}>
              <div className="ct-catalog-row-left">
                <span className="ct-catalog-row-name">{ex.name}</span>
                <span className="ct-catalog-row-cat">{ex.category}</span>
              </div>
              <span className="ct-catalog-row-defaults">
                {ex.defaultSets} × {ex.defaultReps}
              </span>
            </button>
          </li>
        ))}
        <li className="ct-catalog-custom-row">
          <button type="button" className="ct-catalog-row ct-catalog-row-custom ct-press" onClick={handleCustom}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Custom exercise{search ? `: "${search}"` : ''}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
