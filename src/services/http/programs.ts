import { get, post, patch } from './client';
import type { Program, ProgramCreateInput } from '@/services/types';

export const programsService = {
  async list(): Promise<Program[]> {
    return get<Program[]>('/programs');
  },

  async get(id: string): Promise<Program | null> {
    try {
      return await get<Program>(`/programs/${id}`);
    } catch {
      return null;
    }
  },

  async updateCover(id: string, coverUrl: string): Promise<Program | null> {
    try {
      return await patch<Program>(`/programs/${id}/cover`, { coverUrl });
    } catch {
      return null;
    }
  },

  async create(input: ProgramCreateInput): Promise<Program> {
    return post<Program>('/programs', input);
  },

  async update(id: string, patchData: Partial<ProgramCreateInput>): Promise<Program> {
    return patch<Program>(`/programs/${id}`, patchData);
  },

  async assign(programId: string, clientIds: string[]): Promise<void> {
    await post(`/programs/${programId}/assign`, { clientIds });
  },
};
