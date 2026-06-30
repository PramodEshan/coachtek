import { get } from './client';
import type { GymCoachPayout, TodaySession, Client, Thread, Message } from '@/services/types';

export const gymCoachService = {
  async todaySessions(): Promise<TodaySession[]> {
    return get<TodaySession[]>('/gym-coach/today-sessions');
  },

  async clients(): Promise<Client[]> {
    return get<Client[]>('/gym-coach/clients');
  },

  async threads(): Promise<Thread[]> {
    return get<Thread[]>('/gym-coach/threads');
  },

  async messages(threadId: string): Promise<Message[]> {
    return get<Message[]>(`/gym-coach/messages/${threadId}`);
  },

  async payroll(): Promise<GymCoachPayout[]> {
    return get<GymCoachPayout[]>('/gym-coach/payroll');
  },

  async gymName(): Promise<string> {
    return get<string>('/gym-coach/gym-name');
  },
};
