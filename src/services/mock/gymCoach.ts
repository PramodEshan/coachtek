import { delay, getStore } from '@/services/mock/store';
import { readSession } from '@/services/mock/auth';
import type { GymCoachPayout, TodaySession, Client, Thread, Message } from '@/services/types';

function currentGymId(): string {
  const session = readSession();
  return session?.user?.gymId ?? 'gym-1';
}

export const gymCoachService = {
  async todaySessions(): Promise<TodaySession[]> {
    await delay();
    return getStore().today;
  },

  async clients(): Promise<Client[]> {
    await delay();
    const gymId = currentGymId();
    return getStore().clients.filter(
      (c) => c.status === 'active' && c.membership === 'gym' && c.gymId === gymId,
    );
  },

  async threads(): Promise<Thread[]> {
    await delay();
    return getStore().threads;
  },

  async messages(threadId: string): Promise<Message[]> {
    await delay();
    return getStore().messages[threadId] ?? [];
  },

  async payroll(): Promise<GymCoachPayout[]> {
    await delay();
    const session = readSession();
    const coachId = session?.user?.id ?? 'gym-coach-1';
    const gymId = currentGymId();
    return getStore().gymCoachPayouts.filter(
      (p) => p.gymCoachId === coachId && p.gymId === gymId,
    );
  },

  async gymName(): Promise<string> {
    await delay(50);
    const gymId = currentGymId();
    const org = getStore().gymOrgs.find((g) => g.id === gymId);
    return org?.name ?? 'My Gym';
  },
};
