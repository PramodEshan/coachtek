import { get, post, patch } from './client';
import type {
  Client,
  ClientPaymentRecord,
  GymCoachPayout,
  GymCoachProfile,
  GymStaffMember,
  GymSummary,
  Program,
  ProgramCreateInput,
} from '@/services/types';

export const gymService = {
  async summary(): Promise<GymSummary> {
    return get<GymSummary>('/gym/summary');
  },

  async coaches() {
    return get('/gym/coaches');
  },

  async clients(): Promise<Client[]> {
    return get<Client[]>('/gym/clients');
  },

  async todaySessions() {
    return get('/gym/today-sessions');
  },

  async staff(): Promise<GymStaffMember[]> {
    return get<GymStaffMember[]>('/gym/staff');
  },

  async clientPayments(): Promise<ClientPaymentRecord[]> {
    return get<ClientPaymentRecord[]>('/gym/client-payments');
  },

  async coachPayouts(): Promise<GymCoachPayout[]> {
    return get<GymCoachPayout[]>('/gym/coach-payouts');
  },

  async coachProfiles(): Promise<GymCoachProfile[]> {
    return get<GymCoachProfile[]>('/gym/coach-profiles');
  },

  async pendingCoachReviews(): Promise<GymCoachProfile[]> {
    return get<GymCoachProfile[]>('/gym/coach-profiles/pending');
  },

  async pendingClientReviews(): Promise<Client[]> {
    return get<Client[]>('/gym/client-reviews/pending');
  },

  async approveCoach(coachId: string): Promise<void> {
    await post(`/gym/coach-profiles/${coachId}/approve`);
  },

  async rejectCoach(coachId: string): Promise<void> {
    await post(`/gym/coach-profiles/${coachId}/reject`);
  },

  async programs(): Promise<Program[]> {
    return get<Program[]>('/gym/programs');
  },

  async getProgram(id: string): Promise<Program | null> {
    try {
      return await get<Program>(`/gym/programs/${id}`);
    } catch {
      return null;
    }
  },

  async createProgram(input: ProgramCreateInput): Promise<Program> {
    return post<Program>('/gym/programs', input);
  },

  async updateProgram(id: string, patchData: Partial<ProgramCreateInput>): Promise<Program> {
    return patch<Program>(`/gym/programs/${id}`, patchData);
  },

  async staffDashboard() {
    return get('/gym/dashboard/staff');
  },

  async adminDashboard() {
    return get('/gym/dashboard/admin');
  },
};
