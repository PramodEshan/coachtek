import { buildActivitySeries } from '@/data/seed';
import { delay, getStore } from '@/services/mock/store';
import type {
  ActivityPoint,
  ActivityRange,
  Client,
  ClientFilter,
  ClientPaymentRecord,
  SessionHistoryItem,
} from '@/services/types';

export const clientsService = {
  async list(filter: ClientFilter = {}): Promise<Client[]> {
    await delay();
    let rows = getStore().clients;
    if (filter.status) rows = rows.filter((c) => c.status === filter.status);
    if (filter.query) {
      const q = filter.query.toLowerCase();
      rows = rows.filter(
        (c) => c.name.toLowerCase().includes(q) || c.program.toLowerCase().includes(q),
      );
    }
    return rows;
  },

  async get(id: string): Promise<Client | null> {
    await delay();
    return getStore().clients.find((c) => c.id === id) ?? null;
  },

  async archive(id: string, reason?: import('@/services/types').ArchiveReason): Promise<Client> {
    await delay();
    const client = getStore().clients.find((c) => c.id === id);
    if (!client) throw new Error('Client not found');
    client.status = 'archived';
    if (reason) client.archiveReason = reason;
    return client;
  },

  async activity(clientId: string, range: ActivityRange): Promise<ActivityPoint[]> {
    await delay();
    void clientId;
    return buildActivitySeries(range);
  },

  async sessionHistory(clientId: string): Promise<SessionHistoryItem[]> {
    await delay();
    return getStore().sessionHistory
      .filter((s) => s.clientId === clientId)
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  async updateSessionNote(sessionId: string, note: string): Promise<SessionHistoryItem> {
    await delay();
    const session = getStore().sessionHistory.find((s) => s.id === sessionId);
    if (!session) throw new Error('Session not found');
    session.note = note;
    return session;
  },

  async clientSessionLogs(clientId: string) {
    await delay();
    return getStore().sessionLogs
      .filter((log) => log.clientId === clientId || log.clientId === 'client-user-1' && clientId === 'c1')
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  async getSessionLog(sessionId: string) {
    await delay();
    return getStore().sessionLogs.find((s) => s.id === sessionId) ?? null;
  },

  async updateSessionLogCoachNote(sessionId: string, coachNote: string) {
    await delay();
    const log = getStore().sessionLogs.find((s) => s.id === sessionId);
    if (!log) throw new Error('Session log not found');
    log.coachNote = coachNote;
    return log;
  },

  async paymentHistory(clientId: string): Promise<ClientPaymentRecord[]> {
    await delay();
    return getStore().clientPayments
      .filter((p) => p.clientId === clientId)
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  async payeeName(client: Client): Promise<string> {
    await delay(50);
    if (client.membership === 'gym' && client.gymId) {
      const gym = getStore().gymOrgs.find((g) => g.id === client.gymId);
      return gym?.name ?? 'Gym';
    }
    return getStore().coach.name;
  },

  async payeeLabels(): Promise<Record<string, { payeeName: string; feeLabel: string }>> {
    await delay(50);
    const store = getStore();
    const labels: Record<string, { payeeName: string; feeLabel: string }> = {};
    for (const client of store.clients) {
      const payeeName =
        client.membership === 'gym' && client.gymId
          ? store.gymOrgs.find((g) => g.id === client.gymId)?.name ?? 'Gym'
          : store.coach.name;
      labels[client.id] = {
        payeeName,
        feeLabel: client.membership === 'gym' ? 'Gym fee' : 'Coach fee',
      };
    }
    return labels;
  },
};
