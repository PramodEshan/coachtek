import { delay, getStore } from '@/services/mock/store';
import { messagesService } from '@/services/mock/messages';
import {
  formatSessionDate,
  rescheduleTargetIso,
  shiftIsoDay,
  sortSessions,
  type RescheduleStrategy,
} from '@/features/coach/calendar/calendarUtils';
import type { CalSession, OutOfOfficeBlock, OutOfOfficeReason, TodaySession } from '@/services/types';

function blocksForMonth(year: number, month: number): Record<string, OutOfOfficeBlock> {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const entries = Object.entries(getStore().calendarBlocks).filter(([key]) => key.startsWith(prefix));
  return Object.fromEntries(entries);
}

function rescheduleMessage(session: CalSession, fromIso: string, toIso: string): string {
  const firstName = session.who.split(' ')[0];
  return `Hi ${firstName}, I need to move our "${session.title}" session from ${formatSessionDate(fromIso)} to ${formatSessionDate(toIso)} at ${session.time}. Please confirm that still works for you.`;
}

async function notifyClient(session: CalSession, text: string): Promise<boolean> {
  const thread = getStore().threads.find((item) => item.clientId === session.clientId);
  if (!thread) return false;
  await messagesService.send(thread.id, text);
  return true;
}

export const calendarService = {
  async today(): Promise<TodaySession[]> {
    await delay();
    return getStore().today;
  },

  async month(year: number, month: number): Promise<Record<string, CalSession[]>> {
    await delay();
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const entries = Object.entries(getStore().calendar).filter(([key]) => key.startsWith(prefix));
    return Object.fromEntries(entries);
  },

  async blocks(year: number, month: number): Promise<Record<string, OutOfOfficeBlock>> {
    await delay();
    return blocksForMonth(year, month);
  },

  async blockDay(iso: string, reason: OutOfOfficeReason): Promise<OutOfOfficeBlock> {
    await delay();
    const block: OutOfOfficeBlock = { iso, reason };
    getStore().calendarBlocks[iso] = block;
    return block;
  },

  async unblockDay(iso: string): Promise<void> {
    await delay();
    delete getStore().calendarBlocks[iso];
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
    await delay();
    const store = getStore();
    const pending = new Set(isos);
    const existingBlocks = new Set(Object.keys(store.calendarBlocks));
    const rescheduleDates = new Set(options?.rescheduleDates ?? isos);
    let rescheduled = 0;
    let messagesSent = 0;

    const affected: { session: CalSession; fromIso: string }[] = [];
    for (const iso of isos) {
      if (!rescheduleDates.has(iso)) continue;
      for (const session of store.calendar[iso] ?? []) {
        affected.push({ session, fromIso: iso });
      }
    }

    if (options?.reschedule && affected.length > 0) {
      for (const { session, fromIso } of affected) {
        const daySessions = store.calendar[fromIso] ?? [];
        const index = daySessions.findIndex((item) => item.id === session.id);
        if (index === -1) continue;

        const [moved] = daySessions.splice(index, 1);
        const toIso = rescheduleTargetIso(fromIso, pending, options.reschedule, existingBlocks);
        if (!store.calendar[toIso]) store.calendar[toIso] = [];
        store.calendar[toIso].push(moved);
        store.calendar[toIso] = sortSessions(store.calendar[toIso]);
        rescheduled += 1;

        if (options.informClients) {
          const sent = await notifyClient(moved, rescheduleMessage(moved, fromIso, toIso));
          if (sent) messagesSent += 1;
        }
      }
    }

    for (const iso of isos) {
      store.calendarBlocks[iso] = { iso, reason };
    }

    return { rescheduled, messagesSent };
  },

  async postponeSession(
    fromIso: string,
    sessionId: string,
    informClient = true,
  ): Promise<{ toIso: string; session: CalSession; messageSent: boolean }> {
    await delay();
    const store = getStore();
    const daySessions = store.calendar[fromIso] ?? [];
    const index = daySessions.findIndex((session) => session.id === sessionId);
    if (index === -1) {
      throw new Error('Session not found');
    }

    const [session] = daySessions.splice(index, 1);
    const toIso = shiftIsoDay(fromIso, 1);
    if (!store.calendar[toIso]) {
      store.calendar[toIso] = [];
    }
    store.calendar[toIso].push(session);
    store.calendar[toIso] = sortSessions(store.calendar[toIso]);

    let messageSent = false;
    if (informClient) {
      messageSent = await notifyClient(session, rescheduleMessage(session, fromIso, toIso));
    }

    return { toIso, session, messageSent };
  },

  async upsertSession(
    iso: string,
    session: Omit<CalSession, 'id'> & { id?: string },
  ): Promise<CalSession> {
    await delay();
    const store = getStore();
    if (!store.calendar[iso]) store.calendar[iso] = [];

    if (session.id) {
      for (const [day, sessions] of Object.entries(store.calendar)) {
        const idx = sessions.findIndex((s) => s.id === session.id);
        if (idx >= 0) {
          const [existing] = sessions.splice(idx, 1);
          const updated: CalSession = { ...existing, ...session, id: existing.id };
          if (!store.calendar[iso]) store.calendar[iso] = [];
          store.calendar[iso].push(updated);
          store.calendar[iso] = sortSessions(store.calendar[iso]);
          if (day !== iso && sessions.length === 0) delete store.calendar[day];
          return updated;
        }
      }
    }

    const created: CalSession = {
      id: session.id ?? `cal-${Date.now()}`,
      time: session.time,
      title: session.title,
      who: session.who,
      clientId: session.clientId,
      mode: session.mode,
    };
    store.calendar[iso].push(created);
    store.calendar[iso] = sortSessions(store.calendar[iso]);
    return created;
  },
};
