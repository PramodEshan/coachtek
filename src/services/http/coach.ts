import { get, post, patch, del } from './client';
import type { CoachProfile, Earnings, InviteLink, NotificationItem } from '@/services/types';

export const coachService = {
  async notifications(): Promise<NotificationItem[]> {
    return get<NotificationItem[]>('/coach/notifications');
  },

  async clearNotifications(): Promise<void> {
    await del('/coach/notifications');
  },

  async invites(): Promise<InviteLink[]> {
    return get<InviteLink[]>('/coach/invites');
  },

  async generateInvite(program: string, label?: string): Promise<InviteLink> {
    return post<InviteLink>('/coach/invites', { program, label });
  },

  async earnings(): Promise<Earnings> {
    return get<Earnings>('/coach/earnings');
  },

  async profile(): Promise<CoachProfile> {
    return get<CoachProfile>('/coach/profile');
  },

  async updatePhoto(photoUrl: string): Promise<CoachProfile> {
    return patch<CoachProfile>('/coach/profile/photo', { photoUrl });
  },

  async updateProfile(patchData: Partial<CoachProfile>): Promise<CoachProfile> {
    return patch<CoachProfile>('/coach/profile', patchData);
  },
};
