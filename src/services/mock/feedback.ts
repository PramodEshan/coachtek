import { delay, getStore } from '@/services/mock/store';
import type { FeedbackItem } from '@/services/types';

export const feedbackService = {
  async list(): Promise<FeedbackItem[]> {
    await delay();
    return getStore().feedback.sort((a, b) => b.date.localeCompare(a.date));
  },

  async reply(id: string, text: string): Promise<FeedbackItem> {
    await delay();
    const item = getStore().feedback.find((f) => f.id === id);
    if (!item) throw new Error('Feedback not found');
    item.replies.push({ from: 'coach', text, at: new Date().toISOString().slice(0, 10) });
    item.status = item.status === 'open' ? 'replied' : item.status;
    return item;
  },

  async resolve(id: string): Promise<FeedbackItem> {
    await delay();
    const item = getStore().feedback.find((f) => f.id === id);
    if (!item) throw new Error('Feedback not found');
    item.status = 'resolved';
    return item;
  },
};
