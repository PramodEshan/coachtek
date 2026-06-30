import { get, post, del } from './client';
import type { RescheduleStrategy } from '@/features/coach/calendar/calendarUtils';
import type { CalSession, OutOfOfficeBlock, OutOfOfficeReason, TodaySession } from '@/services/types';

export const calendarService = {
  async today(): Promise<TodaySession[]> {
    return get<TodaySession[]>('/coach/calendar/today');
  },

  async month(year: number, month: number): Promise<Record<string, CalSession[]>> {
    return get<Record<string, CalSession[]>>(`/coach/calendar/month?year=${year}&month=${month}`);
  },

  async blocks(year: number, month: number): Promise<Record<string, OutOfOfficeBlock>> {
    return get<Record<string, OutOfOfficeBlock>>(`/coach/calendar/blocks?year=${year}&month=${month}`);
  },

  async blockDay(iso: string, reason: OutOfOfficeReason): Promise<OutOfOfficeBlock> {
    return post<OutOfOfficeBlock>('/coach/calendar/blocks', { iso, reason });
  },

  async unblockDay(iso: string): Promise<void> {
    await del(`/coach/calendar/blocks/${encodeURIComponent(iso)}`);
  },

  async blockDays(
    isos: string[],
    reason: OutOfOfficeReason,
    options?: {
      reschedule?: RescheduleStrategy;
      informClients?: boolean;
      rescheduleDates?: string[];
    },
  ): Promise<{ rescheduled: number; messagesSent: number }> {
    return post('/coach/calendar/blocks/batch', { isos, reason, ...options });
  },

  async postponeSession(
    fromIso: string,
    sessionId: string,
    informClient = true,
  ): Promise<{ toIso: string; session: CalSession; messageSent: boolean }> {
    return post(`/coach/calendar/sessions/${sessionId}/postpone`, {
      fromIso,
      informClient,
    });
  },

  async upsertSession(
    iso: string,
    session: Omit<CalSession, 'id'> & { id?: string },
  ): Promise<CalSession> {
    return post<CalSession>('/coach/calendar/sessions', { iso, ...session });
  },
};
