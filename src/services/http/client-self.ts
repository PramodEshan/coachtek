import { get, post, patch } from './client';
import type {
  BodyMetricEntry,
  ClientPaymentRecord,
  ClientProfile,
  ClientProgressSummary,
  ClientWorkout,
  CompleteWorkoutInput,
  ProgressPhoto,
  SessionCompletionLog,
} from '@/services/types';

export const clientService = {
  async profile(): Promise<ClientProfile> {
    return get<ClientProfile>('/client/profile');
  },

  async todayWorkout(): Promise<ClientWorkout> {
    return get<ClientWorkout>('/client/today-workout');
  },

  async bodyMetrics(): Promise<BodyMetricEntry[]> {
    return get<BodyMetricEntry[]>('/client/body-metrics');
  },

  async sessionLogs(): Promise<SessionCompletionLog[]> {
    return get<SessionCompletionLog[]>('/client/session-logs');
  },

  async progressSummary(): Promise<ClientProgressSummary> {
    return get<ClientProgressSummary>('/client/progress-summary');
  },

  async completeWorkout(input: CompleteWorkoutInput): Promise<void> {
    await post('/client/complete-workout', input);
  },

  async updateProfile(patchData: Partial<ClientProfile>): Promise<ClientProfile> {
    return patch<ClientProfile>('/client/profile', patchData);
  },

  async pauseSubscription(): Promise<void> {
    await post('/client/pause-subscription');
  },

  async exportData(): Promise<string> {
    return get<string>('/client/export-data');
  },

  async paymentHistory(): Promise<ClientPaymentRecord[]> {
    return get<ClientPaymentRecord[]>('/client/payment-history');
  },

  async sessionById(sessionId: string): Promise<SessionCompletionLog | null> {
    try {
      return await get<SessionCompletionLog>(`/client/session-logs/${sessionId}`);
    } catch {
      return null;
    }
  },

  async saveBodyMetric(entry: BodyMetricEntry): Promise<BodyMetricEntry[]> {
    return post<BodyMetricEntry[]>('/client/body-metrics', entry);
  },

  async progressPhotos(): Promise<ProgressPhoto[]> {
    return get<ProgressPhoto[]>('/client/progress-photos');
  },

  async uploadProgressPhoto(dataUrl: string, note?: string): Promise<ProgressPhoto> {
    return post<ProgressPhoto>('/client/progress-photos', { dataUrl, note });
  },

  async submitFeedback(input: {
    category: 'coach' | 'platform' | 'billing';
    description: string;
  }): Promise<void> {
    await post('/client/feedback', input);
  },
};
