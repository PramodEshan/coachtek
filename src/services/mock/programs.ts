import { delay, getStore } from '@/services/mock/store';
import { readSession } from '@/services/mock/auth';
import type { Program, ProgramCreateInput, Tint } from '@/services/types';

const TINTS: Tint[] = ['sage', 'clay', 'sky', 'lilac', 'amber', 'rose', 'teal', 'stone'];

function programsForSession(): Program[] {
  const session = readSession();
  const programs = getStore().programs;

  if (!session?.user) return programs;

  const { role, id, gymId } = session.user;

  if (role === 'gym_coach') {
    return programs.filter(
      (p) => p.source === 'gym' && p.gymId === gymId && p.assignedCoachIds?.includes(id),
    );
  }

  if (role === 'solo_coach') {
    return programs.filter((p) => p.source === 'solo_coach' && p.soloCoachId === id);
  }

  if (role === 'gym_admin') {
    return programs.filter((p) => p.source === 'gym' && p.gymId === gymId);
  }

  return programs;
}

export const programsService = {
  async list(): Promise<Program[]> {
    await delay();
    return programsForSession();
  },

  async get(id: string): Promise<Program | null> {
    await delay();
    return programsForSession().find((p) => p.id === id) ?? null;
  },

  async updateCover(id: string, coverUrl: string): Promise<Program | null> {
    await delay();
    const session = readSession();
    if (session?.user.role === 'gym_coach') return null;

    const store = getStore();
    const program = store.programs.find((p) => p.id === id);
    if (!program || program.source !== 'solo_coach') return null;
    program.coverUrl = coverUrl;
    return program;
  },

  async create(input: ProgramCreateInput): Promise<Program> {
    await delay();
    const session = readSession();
    if (!session?.user || session.user.role !== 'solo_coach') {
      throw new Error('Only solo coaches can create programs');
    }

    const program: Program = {
      id: `p-${Date.now()}`,
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
      source: 'solo_coach',
      soloCoachId: session.user.id,
    };

    getStore().programs.push(program);
    return program;
  },

  async update(id: string, patch: Partial<ProgramCreateInput>): Promise<Program> {
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

  async assign(programId: string, clientIds: string[]): Promise<void> {
    await delay();
    const store = getStore();
    const program = store.programs.find((p) => p.id === programId);
    if (!program) throw new Error('Program not found');

    for (const clientId of clientIds) {
      const client = store.clients.find((c) => c.id === clientId);
      if (client) {
        client.program = program.name;
        program.assigned += 1;
      }
    }
  },
};
