import { get, post, patch } from './client';
import type {
  AuditLogEntry,
  CoachClientAssignment,
  GymOrganization,
  OperatorComplaint,
  OperatorDashboardSummary,
  OperatorFinancialOverview,
  PendingCoach,
  SubscriptionTier,
  SuperAdminDashboardSummary,
  TenantStatus,
  VettingStatus,
} from '@/services/types';

export const operatorService = {
  async stats() {
    return get('/platform/stats');
  },

  async dashboardSummary(): Promise<OperatorDashboardSummary> {
    return get<OperatorDashboardSummary>('/platform/dashboard-summary');
  },

  async pendingCoaches(): Promise<PendingCoach[]> {
    return get<PendingCoach[]>('/platform/pending-coaches');
  },

  async coach(id: string): Promise<PendingCoach | undefined> {
    try {
      return await get<PendingCoach>(`/platform/coaches/${id}`);
    } catch {
      return undefined;
    }
  },

  async vetCoach(id: string, status: VettingStatus, reason?: string): Promise<void> {
    await post(`/platform/coaches/${id}/vet`, { status, reason });
  },

  async assignments(): Promise<CoachClientAssignment[]> {
    return get<CoachClientAssignment[]>('/platform/assignments');
  },

  async reassign(
    assignmentId: string,
    newCoachId: string,
    newCoachName: string,
    reason: string,
  ): Promise<void> {
    await post(`/platform/assignments/${assignmentId}/reassign`, {
      newCoachId,
      newCoachName,
      reason,
    });
  },

  async financialOverview(): Promise<OperatorFinancialOverview> {
    return get<OperatorFinancialOverview>('/platform/financial-overview');
  },

  async complaints(): Promise<OperatorComplaint[]> {
    return get<OperatorComplaint[]>('/platform/complaints');
  },

  async complaint(id: string): Promise<OperatorComplaint | undefined> {
    try {
      return await get<OperatorComplaint>(`/platform/complaints/${id}`);
    } catch {
      return undefined;
    }
  },

  async updateComplaint(
    id: string,
    status: OperatorComplaint['status'],
    note?: string,
  ): Promise<void> {
    await patch(`/platform/complaints/${id}`, { status, note });
  },

  async escalateComplaint(id: string, reason: string): Promise<void> {
    await post(`/platform/complaints/${id}/escalate`, { reason });
  },

  async tiers(): Promise<SubscriptionTier[]> {
    return get<SubscriptionTier[]>('/platform/tiers');
  },

  async updateTier(id: string, patchData: Partial<SubscriptionTier>): Promise<void> {
    await patch(`/platform/tiers/${id}`, patchData);
  },

  async gymOrgs(): Promise<GymOrganization[]> {
    return get<GymOrganization[]>('/platform/gym-orgs');
  },

  async gymOrg(id: string): Promise<GymOrganization | undefined> {
    try {
      return await get<GymOrganization>(`/platform/gym-orgs/${id}`);
    } catch {
      return undefined;
    }
  },

  async registerGym(data: {
    name: string;
    location?: string;
    plan: string;
    adminName: string;
    adminEmail: string;
  }): Promise<GymOrganization> {
    return post<GymOrganization>('/platform/gym-orgs', data);
  },

  async suspendGym(id: string, reason: string): Promise<void> {
    await post(`/platform/gym-orgs/${id}/suspend`, { reason });
  },

  async reactivateGym(id: string): Promise<void> {
    await post(`/platform/gym-orgs/${id}/reactivate`);
  },

  async suspendSoloCoach(id: string, reason: string): Promise<void> {
    await post(`/platform/solo-coaches/${id}/suspend`, { reason });
  },

  async soloCoachRegistry(): Promise<PendingCoach[]> {
    return get<PendingCoach[]>('/platform/solo-coach-registry');
  },
};

export const superadminService = {
  async stats() {
    return get('/platform/superadmin/stats');
  },

  async dashboardSummary(): Promise<SuperAdminDashboardSummary> {
    return get<SuperAdminDashboardSummary>('/platform/superadmin/dashboard-summary');
  },

  async escalations(): Promise<OperatorComplaint[]> {
    return get<OperatorComplaint[]>('/platform/superadmin/escalations');
  },

  async auditLog(): Promise<AuditLogEntry[]> {
    return get<AuditLogEntry[]>('/platform/superadmin/audit-log');
  },

  async tiers(): Promise<SubscriptionTier[]> {
    return get<SubscriptionTier[]>('/platform/superadmin/tiers');
  },

  async gymOrgs(): Promise<GymOrganization[]> {
    return get<GymOrganization[]>('/platform/superadmin/gym-orgs');
  },

  async deactivateGym(id: string, reason: string): Promise<void> {
    await post(`/platform/superadmin/gym-orgs/${id}/deactivate`, { reason });
  },

  async overrideGymStatus(id: string, status: TenantStatus): Promise<void> {
    await post(`/platform/superadmin/gym-orgs/${id}/override-status`, { status });
  },

  async soloCoachRegistry(): Promise<PendingCoach[]> {
    return get<PendingCoach[]>('/platform/superadmin/solo-coach-registry');
  },

  async deactivateSoloCoach(id: string, reason: string): Promise<void> {
    await post(`/platform/superadmin/solo-coaches/${id}/deactivate`, { reason });
  },
};
