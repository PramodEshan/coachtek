import { delay, getStore } from '@/services/mock/store';
import { OPERATOR_DEMO_STATS_V2, SUPERADMIN_DEMO_STATS } from '@/data/roleSeed';
import type {
  AuditLogEntry,
  CoachClientAssignment,
  GymOrganization,
  OperatorComplaint,
  OperatorDashboardSummary,
  PendingCoach,
  SubscriptionTier,
  SuperAdminDashboardSummary,
  TenantStatus,
  VettingStatus,
} from '@/services/types';

function auditEntry(action: string, detail: string, actor = 'Sam Operator'): void {
  getStore().auditLog.unshift({
    id: `al-${Date.now()}`,
    at: new Date().toISOString(),
    actor,
    action,
    detail,
  });
}

export const operatorService = {
  async stats() {
    await delay();
    return OPERATOR_DEMO_STATS_V2;
  },

  async dashboardSummary(): Promise<OperatorDashboardSummary> {
    await delay();
    const stats = OPERATOR_DEMO_STATS_V2;
    return {
      pendingOnboarding: stats.pendingSoloCoaches + stats.pendingGyms,
      pendingSoloCoaches: stats.pendingSoloCoaches,
      pendingGyms: stats.pendingGyms,
      activeClients: stats.activeClients,
      openComplaints: stats.openComplaints,
      newRegistrations7d: stats.newRegistrations7d,
      onboardingTrend: [
        { label: 'W1', value: 4 },
        { label: 'W2', value: 3 },
        { label: 'W3', value: 5 },
        { label: 'W4', value: stats.pendingSoloCoaches + stats.pendingGyms },
      ],
      registrationTrend: [
        { label: 'W1', value: 3 },
        { label: 'W2', value: 4 },
        { label: 'W3', value: 6 },
        { label: 'W4', value: stats.newRegistrations7d },
      ],
    };
  },

  async pendingCoaches(): Promise<PendingCoach[]> {
    await delay();
    return getStore().pendingCoaches.filter((c) => c.vettingStatus === 'pending');
  },

  async coach(id: string): Promise<PendingCoach | undefined> {
    await delay();
    return getStore().pendingCoaches.find((c) => c.id === id);
  },

  async vetCoach(id: string, status: VettingStatus, reason?: string): Promise<void> {
    await delay();
    const coach = getStore().pendingCoaches.find((c) => c.id === id);
    if (coach) coach.vettingStatus = status;
    auditEntry(status === 'approved' ? 'Approved coach' : 'Rejected coach', `${coach?.name ?? id}${reason ? ` — ${reason}` : ''}`);
  },

  async assignments(): Promise<CoachClientAssignment[]> {
    await delay();
    return getStore().assignments;
  },

  async reassign(
    assignmentId: string,
    newCoachId: string,
    newCoachName: string,
    reason: string,
  ): Promise<void> {
    await delay();
    const assignment = getStore().assignments.find((a) => a.id === assignmentId);
    if (!assignment) throw new Error('Assignment not found');
    const detail = `${assignment.clientName}: ${assignment.coachName} → ${newCoachName} (${reason})`;
    assignment.coachId = newCoachId;
    assignment.coachName = newCoachName;
    assignment.assignedDate = new Date().toISOString().slice(0, 10);
    auditEntry('Reassigned client', detail);
  },

  async financialOverview(): Promise<import('@/services/types').OperatorFinancialOverview> {
    await delay();
    const store = getStore();
    const payments = store.clientPayments;
    const thisMonth = payments.filter((p) => p.date.startsWith('2026-06'));
    const lastMonth = payments.filter((p) => p.date.startsWith('2026-05'));
    return {
      activeSubscriptions: store.clients.filter((c) => c.status === 'active').length,
      expiringSoon: 3,
      failedPayments: payments.filter((p) => p.status === 'failed').length,
      revenueThisMonth: thisMonth.reduce((s, p) => s + (p.status === 'paid' ? p.amount : 0), 0),
      revenueLastMonth: lastMonth.reduce((s, p) => s + (p.status === 'paid' ? p.amount : 0), 0),
    };
  },

  async complaints(): Promise<OperatorComplaint[]> {
    await delay();
    return getStore().operatorComplaints.filter((c) => c.scope !== 'gym');
  },

  async complaint(id: string): Promise<OperatorComplaint | undefined> {
    await delay();
    return getStore().operatorComplaints.find((c) => c.id === id);
  },

  async updateComplaint(id: string, status: OperatorComplaint['status'], note?: string): Promise<void> {
    await delay();
    const item = getStore().operatorComplaints.find((c) => c.id === id);
    if (!item) return;
    item.status = status;
    if (note?.trim()) item.internalNotes.push(note.trim());
  },

  async escalateComplaint(id: string, reason: string): Promise<void> {
    await delay();
    await this.updateComplaint(id, 'escalated', reason);
  },

  async tiers(): Promise<SubscriptionTier[]> {
    await delay();
    return getStore().subscriptionTiers;
  },

  async updateTier(id: string, patch: Partial<SubscriptionTier>): Promise<void> {
    await delay();
    const tier = getStore().subscriptionTiers.find((t) => t.id === id);
    if (tier) Object.assign(tier, patch);
  },

  async gymOrgs(): Promise<GymOrganization[]> {
    await delay();
    return getStore().gymOrgs;
  },

  async gymOrg(id: string): Promise<GymOrganization | undefined> {
    await delay();
    return getStore().gymOrgs.find((g) => g.id === id);
  },

  async registerGym(data: { name: string; location?: string; plan: string; adminName: string; adminEmail: string }): Promise<GymOrganization> {
    await delay();
    const id = `gym-${Date.now()}`;
    const org: GymOrganization = {
      id,
      name: data.name,
      location: data.location,
      status: 'active',
      subscriptionPlan: data.plan,
      registeredBy: 'operator-1',
      registeredAt: new Date().toISOString().slice(0, 10),
      primaryAdminEmail: data.adminEmail,
      activeCoaches: 0,
      activeClients: 0,
    };
    getStore().gymOrgs.push(org);
    auditEntry('Registered gym', `${data.name} — admin: ${data.adminEmail}`);
    return org;
  },

  async suspendGym(id: string, reason: string): Promise<void> {
    await delay();
    const gym = getStore().gymOrgs.find((g) => g.id === id);
    if (gym) gym.status = 'suspended';
    auditEntry('Suspended gym', `${gym?.name ?? id} — ${reason}`);
  },

  async reactivateGym(id: string): Promise<void> {
    await delay();
    const gym = getStore().gymOrgs.find((g) => g.id === id);
    if (gym) gym.status = 'active';
    auditEntry('Reactivated gym', gym?.name ?? id);
  },

  async suspendSoloCoach(id: string, reason: string): Promise<void> {
    await delay();
    const coach = getStore().pendingCoaches.find((c) => c.id === id);
    if (coach) coach.vettingStatus = 'rejected';
    auditEntry('Suspended solo coach', `${coach?.name ?? id} — ${reason}`);
  },

  async soloCoachRegistry(): Promise<PendingCoach[]> {
    await delay();
    return getStore().pendingCoaches;
  },
};

export const superadminService = {
  async stats() {
    await delay();
    return SUPERADMIN_DEMO_STATS;
  },

  async dashboardSummary(): Promise<SuperAdminDashboardSummary> {
    await delay();
    const gyms = getStore().gymOrgs.filter((g) => g.status === 'active').length;
    const clients = getStore().clients.filter((c) => c.status === 'active').length;
    const soloCoaches = OPERATOR_DEMO_STATS_V2.activeSoloCoaches + OPERATOR_DEMO_STATS_V2.pendingSoloCoaches;
    const platformRevenue = getStore().clientPayments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      platformRevenue,
      revenueGrowthPct: 14,
      soloCoachCount: soloCoaches,
      soloCoachGrowthPct: 12,
      gymCount: gyms,
      gymGrowthPct: 25,
      clientCount: clients,
      clientGrowthPct: 18,
      revenueTrend: [
        { label: 'Mar', value: 8200 },
        { label: 'Apr', value: 9100 },
        { label: 'May', value: 10400 },
        { label: 'Jun', value: platformRevenue },
      ],
      soloCoachTrend: [
        { label: 'Mar', value: 8 },
        { label: 'Apr', value: 9 },
        { label: 'May', value: 10 },
        { label: 'Jun', value: soloCoaches },
      ],
      gymTrend: [
        { label: 'Mar', value: 2 },
        { label: 'Apr', value: 2 },
        { label: 'May', value: 3 },
        { label: 'Jun', value: gyms },
      ],
      clientTrend: [
        { label: 'Mar', value: 32 },
        { label: 'Apr', value: 38 },
        { label: 'May', value: 42 },
        { label: 'Jun', value: clients },
      ],
    };
  },

  async escalations(): Promise<OperatorComplaint[]> {
    await delay();
    return getStore().operatorComplaints.filter((c) => c.status === 'escalated');
  },

  async auditLog(): Promise<AuditLogEntry[]> {
    await delay();
    return getStore().auditLog;
  },

  async tiers(): Promise<SubscriptionTier[]> {
    return operatorService.tiers();
  },

  async gymOrgs(): Promise<GymOrganization[]> {
    await delay();
    return getStore().gymOrgs;
  },

  async deactivateGym(id: string, reason: string): Promise<void> {
    await delay();
    const gym = getStore().gymOrgs.find((g) => g.id === id);
    if (gym) gym.status = 'deactivated';
    auditEntry('Deactivated gym', `${gym?.name ?? id} — ${reason}`, 'Taylor Admin');
  },

  async overrideGymStatus(id: string, status: TenantStatus): Promise<void> {
    await delay();
    const gym = getStore().gymOrgs.find((g) => g.id === id);
    if (gym) gym.status = status;
    auditEntry('Override gym status', `${gym?.name ?? id} → ${status}`, 'Taylor Admin');
  },

  async soloCoachRegistry(): Promise<PendingCoach[]> {
    return operatorService.soloCoachRegistry();
  },

  async deactivateSoloCoach(id: string, reason: string): Promise<void> {
    await delay();
    const coach = getStore().pendingCoaches.find((c) => c.id === id);
    if (coach) coach.vettingStatus = 'rejected';
    auditEntry('Deactivated solo coach', `${coach?.name ?? id} — ${reason}`, 'Taylor Admin');
  },
};
