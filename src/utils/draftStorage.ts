const PREFIX = 'coachtek:draft:';

export function saveDraft<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify({ savedAt: Date.now(), value }));
  } catch {
    // quota or private mode
  }
}

export function loadDraft<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { value: T };
    return parsed.value ?? null;
  } catch {
    return null;
  }
}

export function clearDraft(key: string): void {
  localStorage.removeItem(`${PREFIX}${key}`);
}
