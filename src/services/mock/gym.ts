import { delay, getStore } from '@/services/mock/store';
import { readSession } from '@/services/mock/auth';
import type { Client, ClientPaymentRecord, GymCoachPayout, GymCoachProfile, GymStaffMember, GymSummary, Program, ProgramCreateInput, Tint } from '@/services/types';

const TINTS: Tint[] = ['sage', 'clay', 'sky', 'lilac', 'amber', 'rose', 'teal', 'stone'];

function currentGymId(): string {
  return readSession()?.user?.gymId ?? 'gym-1';
}

export const gymService = {
  async summary(): Promise<GymSummary> {
    await delay();
    return getStore().gym;
  },

  async coaches() {
    await delay();
    return getStore().gymCoaches;
  },

  async clients(): Promise<Client[]> {
    await delay();
    return getStore().clients.filter((c) => c.status === 'active');
  },

  async todaySessions() {
    await delay();
    return getStore().today;
  },

  async staff(): Promise<GymStaffMember[]> {
    await delay();
    return getStore().gymStaff;
  },

  async clientPayments(): Promise<ClientPaymentRecord[]> {
    await delay();
    const gymId = currentGymId();
    return getStore().clientPayments.filter((p) => p.gymId === gymId);
  },

  async coachPayouts(): Promise<GymCoachPayout[]> {
    await delay();
    const gymId = currentGymId();
    return getStore().gymCoachPayouts.filter((p) => p.gymId === gymId);
  },

  async coachProfiles(): Promise<GymCoachProfile[]> {
    await delay();
    const gymId = currentGymId();
    return getStore().gymCoachProfiles.filter((p) => p.gymId === gymId);
  },

  async pendingCoachReviews(): Promise<GymCoachProfile[]> {
    await delay();
    const gymId = currentGymId();
    return getStore().gymCoachProfiles.filter((p) => p.gymId === gymId && p.status === 'pending');
  },

  async pendingClientReviews(): Promise<Client[]> {
    await delay();
    return [];
  },

  async approveCoach(coachId: string): Promise<void> {
    await delay();
    const profile = getStore().gymCoachProfiles.find((p) => p.id === coachId);
    if (profile) profile.status = 'active';
  },

  async rejectCoach(coachId: string): Promise<void> {
    await delay();
    const profile = getStore().gymCoachProfiles.find((p) => p.id === coachId);
    if (profile) profile.status = 'deactivated';
  },

  async programs(): Promise<Program[]> {
    await delay();
    const gymId = currentGymId();
    return getStore().programs.filter((p) => p.source === 'gym' && p.gymId === gymId);
  },

  async getProgram(id: string): Promise<Program | null> {
    await delay();
    const gymId = currentGymId();
    return getStore().programs.find((p) => p.id === id && p.source === 'gym' && p.gymId === gymId) ?? null;
  },

  async createProgram(input: ProgramCreateInput): Promise<Program> {
    await delay();
    const gymId = currentGymId();
    const program: Program = {
      id: `gym-p-${Date.now()}`,
      name: input.name,
      tag: input.tag,
      weeks: input.weeks,
      days: input.days,
      assigned: 0,
      color: TINTS[Math.floor(Math.random() * TINTS.length)],
      price: input.price,
      priceLabel: input.priceLabel,
      desc: input.desc,
      structure: input.structure,
      source: 'gym',
      gymId,
    };
    getStore().programs.push(program);
    return program;
  },

  async updateProgram(id: string, patch: Partial<ProgramCreateInput>): Promise<Program> {
    await delay();
    const program = getStore().programs.find((p) => p.id === id);
    if (!program) throw new Error('Program not found');
    if (patch.name) program.name = patch.name;
    if (patch.tag) program.tag = patch.tag;
    if (patch.weeks) program.weeks = patch.weeks;
    if (patch.days) program.days = patch.days;
    if (patch.price) program.price = patch.price;
    if (patch.priceLabel) program.priceLabel = patch.priceLabel;
    if (patch.desc) program.desc = patch.desc;
    if (patch.structure) program.structure = patch.structure;
    return program;
  },

  async staffDashboard() {
    await delay();
    const gymId = currentGymId();
    const gym = getStore().gym;
    const sessions = getStore().today;
    const payments = getStore().clientPayments.filter((p) => p.gymId === gymId);
    const attendedToday = sessions.filter((s) => s.state === 'done' || s.state === 'ended').length;
    const inGymNow = sessions.filter((s) => s.state === 'ongoing').length;
    const checkInsPending = sessions.filter((s) => s.state === 'upcoming').length;
    const expectedToday = sessions.length;
    const attendanceRate = expectedToday ? Math.round((attendedToday / expectedToday) * 100) : 0;

    return {
      gymName: gym.name,
      attendedToday,
      inGymNow,
      expectedToday,
      attendanceRate,
      checkInsPending,
      unpaidPayments: payments.filter((p) => p.status === 'pending').length,
      weeklyAttendance: [
        { label: 'Mon', value: 16 },
        { label: 'Tue', value: 19 },
        { label: 'Wed', value: 21 },
        { label: 'Thu', value: 18 },
        { label: 'Fri', value: attendedToday + inGymNow + checkInsPending },
        { label: 'Sat', value: 12 },
        { label: 'Sun', value: 8 },
      ],
    };
  },

  async adminDashboard() {
    await delay();
    const gymId = currentGymId();
    const gym = getStore().gym;
    const payments = getStore().clientPayments.filter((p) => p.gymId === gymId && p.status === 'paid');
    const thisMonth = payments.filter((p) => p.date.startsWith('2026-06')).reduce((s, p) => s + p.amount, 0);
    const lastMonth = payments.filter((p) => p.date.startsWith('2026-05')).reduce((s, p) => s + p.amount, 0);
    const paymentGrowthPct = lastMonth ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;

    return {
      gymName: gym.name,
      activeClients: gym.activeClients,
      activeCoaches: gym.activeCoaches,
      clientGrowthPct: 17,
      coachGrowthPct: 50,
      paymentGrowthPct,
      revenueThisMonth: thisMonth,
      revenueLastMonth: lastMonth,
      clientTrend: [
        { label: 'Mar', value: 18 },
        { label: 'Apr', value: 20 },
        { label: 'May', value: 21 },
        { label: 'Jun', value: gym.activeClients },
      ],
      coachTrend: [
        { label: 'Mar', value: 2 },
        { label: 'Apr', value: 2 },
        { label: 'May', value: 2 },
        { label: 'Jun', value: gym.activeCoaches },
      ],
      paymentTrend: [
        { label: 'Mar', value: 3200 },
        { label: 'Apr', value: 3680 },
        { label: 'May', value: lastMonth },
        { label: 'Jun', value: thisMonth },
      ],
    };
  },
};
