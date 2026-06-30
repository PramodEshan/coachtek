import { delay, getStore } from '@/services/mock/store';
import type { CoachProfile, Earnings, InviteLink, NotificationItem } from '@/services/types';

export const coachService = {
  async notifications(): Promise<NotificationItem[]> {
    return getStore().notifications;
  },

  async clearNotifications(): Promise<void> {
    getStore().notifications = [];
  },

  async invites(): Promise<InviteLink[]> {
    await delay();
    return getStore().invites;
  },

  async generateInvite(program: string, label?: string): Promise<InviteLink> {
    await delay();
    const invite: InviteLink = {
      id: `i-${Date.now()}`,
      label: label ?? `${program} — open`,
      program,
      uses: 0,
      created: new Date().toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
    };
    getStore().invites.unshift(invite);
    return invite;
  },

  async earnings(): Promise<Earnings> {
    await delay();
    return getStore().earnings;
  },

  async profile(): Promise<CoachProfile> {
    await delay();
    return getStore().profile;
  },

  async updatePhoto(photoUrl: string): Promise<CoachProfile> {
    await delay();
    getStore().profile.photoUrl = photoUrl;
    return getStore().profile;
  },

  async updateProfile(patch: Partial<CoachProfile>): Promise<CoachProfile> {
    await delay();
    Object.assign(getStore().profile, patch);
    return getStore().profile;
  },
};
