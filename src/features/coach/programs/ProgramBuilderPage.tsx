import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProgramCreateInput, ProgramDay, ProgramExercise } from '@/services/types';
import { buildDefaultDays, normalizeProgramDays } from '@/utils/programStructure';
import { ExerciseCatalogPicker } from './ExerciseCatalogPicker';
import { ProgramExerciseRow } from './ProgramExerciseRow';

interface ProgramBuilderPageProps {
  loadProgram?: (id: string) => Promise<Partial<ProgramCreateInput> & { id?: string } | null>;
  onSave: (input: ProgramCreateInput, id?: string) => Promise<void>;
  backPath?: string;
}

export function ProgramBuilderPage({ loadProgram, onSave, backPath }: ProgramBuilderPageProps) {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const isEdit = !!programId;

  const [name, setName] = useState('');
  const [tag, setTag] = useState('Strength');
  const [weeks, setWeeks] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [price, setPrice] = useState('£129');
  const [priceLabel, setPriceLabel] = useState('per month');
  const [desc, setDesc] = useState('');
  const [days, setDays] = useState<ProgramDay[]>(() => buildDefaultDays(4));
  const [activeDay, setActiveDay] = useState(0);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);
  const [metaExpanded, setMetaExpanded] = useState(false);

  useEffect(() => {
    if (!isEdit || !loadProgram || !programId) return;
    loadProgram(programId).then((data) => {
      if (!data) {
        navigate(backPath ?? -1 as never);
        return;
      }
      setName(data.name ?? '');
      setTag(data.tag ?? 'Strength');
      setWeeks(data.weeks ?? 8);
      setDaysPerWeek(data.days ?? 4);
      setPrice(data.price ?? '£129');
      setPriceLabel(data.priceLabel ?? 'per month');
      setDesc(data.desc ?? '');
      if (data.structure?.length) {
        setDays(normalizeProgramDays(data.structure as never));
      } else {
        setDays(buildDefaultDays(data.days ?? 4));
      }
      setLoaded(true);
    });
  }, [isEdit, programId]);

  useEffect(() => {
    if (!loaded) return;
    setDays((prev) => {
      if (prev.length === daysPerWeek) return prev;
      if (prev.length < daysPerWeek) {
        return [
          ...prev,
          ...Array.from({ length: daysPerWeek - prev.length }, (_, i) => ({
            day: `Day ${prev.length + i + 1}`,
            label: '',
            exercises: [],
          })),
        ];
      }
      return prev.slice(0, daysPerWeek);
    });
  }, [daysPerWeek, loaded]);

  useEffect(() => {
    if (activeDay >= daysPerWeek) setActiveDay(Math.max(0, daysPerWeek - 1));
  }, [daysPerWeek]);

  function updateDay(index: number, patch: Partial<ProgramDay>) {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  function updateExercise(dayIdx: number, exIdx: number, updated: ProgramExercise) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? { ...d, exercises: d.exercises.map((ex, j) => (j === exIdx ? updated : ex)) }
          : d,
      ),
    );
  }

  function removeExercise(dayIdx: number, exIdx: number) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx ? { ...d, exercises: d.exercises.filter((_, j) => j !== exIdx) } : d,
      ),
    );
  }

  function moveExercise(dayIdx: number, from: number, to: number) {
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== dayIdx) return d;
        const exs = [...d.exercises];
        const [item] = exs.splice(from, 1);
        exs.splice(to, 0, item);
        return { ...d, exercises: exs };
      }),
    );
  }

  function addExercise(exercise: ProgramExercise) {
    setDays((prev) =>
      prev.map((d, i) => (i === activeDay ? { ...d, exercises: [...d.exercises, exercise] } : d)),
    );
    setCatalogOpen(false);
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const input: ProgramCreateInput = {
        name,
        tag,
        weeks,
        days: daysPerWeek,
        price,
        priceLabel,
        desc,
        structure: days,
      };
      await onSave(input, programId);
      navigate(backPath ?? (-1 as never));
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) {
    return (
      <div className="ct-builder-loading">
        <div className="ct-builder-loading-spinner" />
        <span>Loading program…</span>
      </div>
    );
  }

  const currentDay = days[activeDay];
  const totalExercises = days.reduce((s, d) => s + d.exercises.length, 0);

  return (
    <div className="ct-program-builder ct-builder-enter">
      {/* Top bar */}
      <header className="ct-builder-header ct-builder-stagger-1">
        <button
          type="button"
          className="ct-builder-back ct-press"
          onClick={() => navigate(backPath ?? (-1 as never))}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>Programs</span>
        </button>
        <div className="ct-builder-header-center">
          <span className="ct-builder-header-badge">{isEdit ? 'Editing' : 'New program'}</span>
        </div>
        <button
          type="button"
          className="ct-builder-save ct-press"
          disabled={saving || !name.trim()}
          onClick={handleSave}
        >
          {saving ? (
            <>
              <span className="ct-builder-save-spinner" />
              Saving
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.3 4.7L6.5 11.5 2.7 7.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Save program
            </>
          )}
        </button>
      </header>

      {/* Program title area */}
      <div className="ct-builder-title-area ct-builder-stagger-2">
        <input
          className="ct-builder-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Untitled program"
        />
        <textarea
          className="ct-builder-desc-input"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Add a program description…"
          rows={1}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
          }}
        />
        <div className="ct-builder-title-stats">
          <span>{weeks} weeks</span>
          <span className="ct-builder-title-dot" />
          <span>{daysPerWeek} days/week</span>
          <span className="ct-builder-title-dot" />
          <span>{totalExercises} exercises</span>
          {price && (
            <>
              <span className="ct-builder-title-dot" />
              <span>{price} {priceLabel}</span>
            </>
          )}
        </div>
      </div>

      {/* Meta collapsible */}
      <div className={`ct-builder-meta-wrap ct-builder-stagger-3 ${metaExpanded ? 'is-expanded' : ''}`}>
        <button
          type="button"
          className="ct-builder-meta-toggle ct-press"
          onClick={() => setMetaExpanded(!metaExpanded)}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 6h8M4 10h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Program settings
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            className="ct-builder-meta-chevron"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {metaExpanded && (
          <div className="ct-builder-meta-fields">
            <div className="ct-builder-meta-row">
              <div className="ct-builder-meta-field">
                <label>Tag / Category</label>
                <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. Strength" />
              </div>
              <div className="ct-builder-meta-field">
                <label>Duration (weeks)</label>
                <input type="number" min={1} value={weeks} onChange={(e) => setWeeks(Number(e.target.value) || 1)} />
              </div>
              <div className="ct-builder-meta-field">
                <label>Days per week</label>
                <input type="number" min={1} max={7} value={daysPerWeek} onChange={(e) => setDaysPerWeek(Number(e.target.value) || 1)} />
              </div>
            </div>
            <div className="ct-builder-meta-row">
              <div className="ct-builder-meta-field">
                <label>Price</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="£129" />
              </div>
              <div className="ct-builder-meta-field">
                <label>Price label</label>
                <input value={priceLabel} onChange={(e) => setPriceLabel(e.target.value)} placeholder="per month" />
              </div>
              <div className="ct-builder-meta-field ct-builder-meta-field-wide">
                <label>Description</label>
                <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief program description" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Day plan builder */}
      <div className="ct-builder-body ct-builder-stagger-4">
        <div className="ct-builder-plan">
          {/* Day pills */}
          <nav className="ct-builder-day-nav">
            <div className="ct-builder-day-pills">
              {days.map((d, i) => (
                <button
                  key={d.day}
                  type="button"
                  className={`ct-day-pill ct-press ${i === activeDay ? 'ct-day-pill-active' : ''}`}
                  onClick={() => setActiveDay(i)}
                >
                  <span className="ct-day-pill-num">{i + 1}</span>
                  <span className="ct-day-pill-label">{d.label || d.day}</span>
                  {d.exercises.length > 0 && (
                    <span className="ct-day-pill-count">{d.exercises.length}</span>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Active day content */}
          {currentDay && (
            <div key={activeDay} className="ct-builder-day-content">
              <div className="ct-builder-day-header">
                <div className="ct-builder-day-header-left">
                  <span className="ct-builder-day-badge">Day {activeDay + 1}</span>
                  <input
                    className="ct-builder-day-label"
                    value={currentDay.label}
                    onChange={(e) => updateDay(activeDay, { label: e.target.value })}
                    placeholder="Label this day (e.g. Lower body, Push day)"
                  />
                </div>
                <span className="ct-builder-day-count">
                  {currentDay.exercises.length} exercise{currentDay.exercises.length !== 1 ? 's' : ''}
                </span>
              </div>

              {currentDay.exercises.length > 0 ? (
                <div className="ct-builder-exercise-list">
                  <div className="ct-exercise-list-header">
                    <span className="ct-exercise-list-h-num">#</span>
                    <span className="ct-exercise-list-h-name">Exercise</span>
                    <span className="ct-exercise-list-h-field">Sets</span>
                    <span className="ct-exercise-list-h-field">Reps</span>
                    <span className="ct-exercise-list-h-field">Rest</span>
                    <span className="ct-exercise-list-h-actions" />
                  </div>
                  {currentDay.exercises.map((ex, idx) => (
                    <ProgramExerciseRow
                      key={ex.id}
                      exercise={ex}
                      index={idx}
                      total={currentDay.exercises.length}
                      onChange={(updated) => updateExercise(activeDay, idx, updated)}
                      onRemove={() => removeExercise(activeDay, idx)}
                      onMoveUp={() => moveExercise(activeDay, idx, idx - 1)}
                      onMoveDown={() => moveExercise(activeDay, idx, idx + 1)}
                    />
                  ))}
                </div>
              ) : (
                <div className="ct-builder-empty">
                  <div className="ct-builder-empty-icon">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect x="4" y="8" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
                      <path d="M20 16v8M16 20h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="ct-builder-empty-title">No exercises yet</p>
                  <p className="ct-builder-empty-desc">
                    Add exercises from the catalog to build this day's training plan
                  </p>
                </div>
              )}

              <button
                type="button"
                className="ct-builder-add-btn ct-press"
                onClick={() => setCatalogOpen(true)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add exercise
              </button>
            </div>
          )}
        </div>

        {/* Catalog side panel / bottom sheet */}
        {catalogOpen && (
          <>
            <div className="ct-builder-catalog-backdrop" onClick={() => setCatalogOpen(false)} />
            <aside className="ct-builder-catalog-panel">
              <ExerciseCatalogPicker
                onSelect={addExercise}
                onClose={() => setCatalogOpen(false)}
              />
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
