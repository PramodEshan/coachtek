import { get, post } from './client';
import type { FeedbackItem } from '@/services/types';

export const feedbackService = {
  async list(): Promise<FeedbackItem[]> {
    return get<FeedbackItem[]>('/coach/feedback');
  },

  async reply(id: string, text: string): Promise<FeedbackItem> {
    return post<FeedbackItem>(`/coach/feedback/${id}/reply`, { text });
  },

  async resolve(id: string): Promise<FeedbackItem> {
    return post<FeedbackItem>(`/coach/feedback/${id}/resolve`);
  },
};
