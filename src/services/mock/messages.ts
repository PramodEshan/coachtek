import { delay, getStore } from '@/services/mock/store';
import type { Message, Thread } from '@/services/types';

export const messagesService = {
  async threads(): Promise<Thread[]> {
    await delay();
    return getStore().threads.sort((a, b) => Number(b.pinned) - Number(a.pinned));
  },

  async threadForClient(clientId: string): Promise<Thread | null> {
    await delay();
    return getStore().threads.find((thread) => thread.clientId === clientId) ?? null;
  },

  async messages(threadId: string): Promise<Message[]> {
    await delay();
    return getStore().messages[threadId] ?? [];
  },

  async send(threadId: string, text: string): Promise<Message> {
    await delay();
    const msg: Message = {
      id: `m-${Date.now()}`,
      from: 'coach',
      t: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };
    const list = getStore().messages[threadId] ?? [];
    list.push(msg);
    getStore().messages[threadId] = list;
    const thread = getStore().threads.find((t) => t.id === threadId);
    if (thread) {
      thread.preview = text;
      thread.time = 'now';
      thread.unread = 0;
    }
    return msg;
  },
};
