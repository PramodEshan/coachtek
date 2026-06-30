import { useCallback, useState } from 'react';
import { coachService } from '@/services/api';
import { getStore } from '@/services/mock/store';
import type { NotificationItem } from '@/services/types';

let cached: NotificationItem[] | null = null;
let inflight: Promise<NotificationItem[]> | null = null;

const SAMPLE_NOTIFICATIONS: Omit<NotificationItem, 'id'>[] = [
  { title: 'Session reminder', sub: 'Jordan Lee at 09:00 tomorrow' },
  { title: 'New message', sub: 'Morgan Chen sent a check-in update' },
  { title: 'Booking request', sub: 'Taylor Brooks asked for Friday 14:00' },
  { title: 'Payout update', sub: '£420 pending transfer scheduled' },
  { title: 'Program shared', sub: 'Strength 12 assigned to a new client' },
];

function syncNotifications(items: NotificationItem[]) {
  cached = items;
  getStore().notifications = items;
}

function loadNotifications(): Promise<NotificationItem[]> {
  if (cached) return Promise.resolve(cached);
  if (!inflight) {
    inflight = coachService.notifications().then((data) => {
      syncNotifications(data);
      return data;
    });
  }
  return inflight;
}

export function useNotifications() {
  const [items, setItems] = useState<NotificationItem[]>(() => cached ?? []);

  const prefetch = useCallback(() => {
    loadNotifications().then(setItems);
  }, []);

  const clear = useCallback(async () => {
    syncNotifications([]);
    setItems([]);
    await coachService.clearNotifications();
  }, []);

  const triggerSample = useCallback(() => {
    const sample = SAMPLE_NOTIFICATIONS[Math.floor(Math.random() * SAMPLE_NOTIFICATIONS.length)]!;
    const item: NotificationItem = {
      id: `n-${Date.now()}`,
      ...sample,
    };

    setItems((prev) => {
      const next = [item, ...prev];
      syncNotifications(next);
      return next;
    });
  }, []);

  return {
    items,
    hasUnread: items.length > 0,
    prefetch,
    clear,
    triggerSample,
  };
}
