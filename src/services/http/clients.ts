import { get, post, patch } from './client';
import type {
  ActivityPoint,
  ActivityRange,
  Client,
  ClientFilter,
  ClientPaymentRecord,
  SessionHistoryItem,
  ArchiveReason,
} from '@/services/types';

export const clientsService = {
  async list(filter: ClientFilter = {}): Promise<Client[]> {
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.query) params.set('query', filter.query);
    const qs = params.toString();
    return get<Client[]>(`/clients${qs ? `?${qs}` : ''}`);
  },

  async get(id: string): Promise<Client | null> {
    try {
      return await get<Client>(`/clients/${id}`);
    } catch {
      return null;
    }
  },

  async archive(id: string, reason?: ArchiveReason): Promise<Client> {
    return post<Client>(`/clients/${id}/archive`, reason ? { reason } : undefined);
  },

  async activity(clientId: string, range: ActivityRange): Promise<ActivityPoint[]> {
    return get<ActivityPoint[]>(`/clients/${clientId}/activity?range=${range}`);
  },

  async sessionHistory(clientId: string): Promise<SessionHistoryItem[]> {
    return get<SessionHistoryItem[]>(`/clients/${clientId}/session-history`);
  },

  async updateSessionNote(sessionId: string, note: string): Promise<SessionHistoryItem> {
    return patch<SessionHistoryItem>(`/clients/sessions/${sessionId}/note`, { note });
  },

  async clientSessionLogs(clientId: string) {
    return get(`/clients/${clientId}/session-logs`);
  },

  async getSessionLog(sessionId: string) {
    return get(`/clients/session-logs/${sessionId}`);
  },

  async updateSessionLogCoachNote(sessionId: string, coachNote: string) {
    return patch(`/clients/session-logs/${sessionId}/coach-note`, { coachNote });
  },

  async paymentHistory(clientId: string): Promise<ClientPaymentRecord[]> {
    return get<ClientPaymentRecord[]>(`/clients/${clientId}/payment-history`);
  },

  async payeeName(client: Client): Promise<string> {
    return get<string>(`/clients/${client.id}/payee-name`);
  },

  async payeeLabels(): Promise<Record<string, { payeeName: string; feeLabel: string }>> {
    return get(`/clients/payee-labels`);
  },
};
