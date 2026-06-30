import type { SessionFeeling } from '@/services/types';

export const SESSION_FEELING_OPTIONS: { value: SessionFeeling; label: string; emoji: string }[] = [
  { value: 'great', label: 'Great', emoji: '😊' },
  { value: 'good', label: 'Good', emoji: '👍' },
  { value: 'okay', label: 'Okay', emoji: '😐' },
  { value: 'tough', label: 'Tough', emoji: '💪' },
  { value: 'exhausted', label: 'Exhausted', emoji: '😴' },
];

export function sessionFeelingLabel(feeling: SessionFeeling): string {
  return SESSION_FEELING_OPTIONS.find((o) => o.value === feeling)?.label ?? feeling;
}

export function sessionFeelingEmoji(feeling: SessionFeeling): string {
  return SESSION_FEELING_OPTIONS.find((o) => o.value === feeling)?.emoji ?? '•';
}
