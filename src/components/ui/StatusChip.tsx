type ChipTone = 'active' | 'pending' | 'overdue' | 'expired' | 'archived' | 'resolved' | 'failed' | 'neutral';

const TONE_CLASS: Record<ChipTone, string> = {
  active: 'ct-pill ct-pill-done',
  pending: 'ct-pill ct-pill-open',
  overdue: 'ct-pill ct-pill-open',
  expired: 'ct-pill ct-pill-open',
  archived: 'ct-pill ct-pill-replied',
  resolved: 'ct-pill ct-pill-resolved',
  failed: 'ct-pill ct-pill-open',
  neutral: 'ct-pill ct-pill-replied',
};

interface StatusChipProps {
  label: string;
  tone?: ChipTone;
}

export function StatusChip({ label, tone = 'neutral' }: StatusChipProps) {
  return <span className={TONE_CLASS[tone]}>{label}</span>;
}
