import type { MonthlyPaymentStatus, Tint, Client, ClientPaymentRecord } from '@/services/types';
import { CALENDAR_MONTH, CALENDAR_YEAR } from '@/features/coach/calendar/calendarUtils';

export const PAYMENT_MONTH_LABEL = new Date(CALENDAR_YEAR, CALENDAR_MONTH - 1, 1).toLocaleString(
  'en-US',
  { month: 'long' },
);

export function paymentReminderText(name: string): string {
  const firstName = name.split(/\s+/)[0] ?? name;
  return `Hi ${firstName}, just a friendly reminder that your ${PAYMENT_MONTH_LABEL} coaching payment is still outstanding. Reply here if you need the payment link or have any questions.`;
}

export function monthlyPaymentPillClass(status: MonthlyPaymentStatus): string {
  return status === 'paid' ? 'ct-pill ct-pill-done' : 'ct-pill ct-pill-overdue';
}

export function monthlyPaymentLabel(status: MonthlyPaymentStatus): string {
  return status === 'paid' ? 'Paid' : 'Unpaid';
}

export function clientMembershipLabel(membership?: Client['membership']): string {
  return membership === 'gym' ? 'Gym member' : 'Solo coach client';
}

export function clientPayeeFeeLabel(membership?: Client['membership']): string {
  return membership === 'gym' ? 'Gym fee' : 'Coach fee';
}

export function clientPayeeSummary(client: Client, payeeName?: string): string {
  if (client.membership === 'gym') {
    return payeeName ? `Pays gym fee to ${payeeName}` : 'Pays gym membership fee';
  }
  return payeeName ? `Pays coach fee to ${payeeName}` : 'Pays coach fee directly';
}

export function paymentRecordStatusClass(status: ClientPaymentRecord['status']): string {
  if (status === 'paid') return 'ct-pill ct-pill-done';
  if (status === 'pending') return 'ct-pill ct-pill-pending';
  return 'ct-pill ct-pill-overdue';
}

export function feedbackPillClass(status: string): string {
  if (status === 'open') return 'ct-pill ct-pill-open';
  if (status === 'resolved') return 'ct-pill ct-pill-resolved';
  return 'ct-pill ct-pill-replied';
}

export function avatarClass(tint: Tint, shape: 'round' | 'square' = 'square'): string {
  return `ct-avatar tint-${tint} ${shape}`;
}
