import {
  MOCK_AUDIT_LOG,
  MOCK_ASSIGNMENTS,
  MOCK_BODY_METRICS,
  MOCK_CLIENT_PAYMENTS,
  MOCK_CLIENT_PROFILE,
  MOCK_CLIENT_WORKOUT,
  MOCK_GYM,
  MOCK_GYM_COACH_PAYOUTS,
  MOCK_GYM_COACH_PROFILES,
  MOCK_GYM_COACHES,
  MOCK_GYM_ORGS,
  MOCK_GYM_PROGRAMS,
  MOCK_GYM_STAFF,
  MOCK_OPERATOR_COMPLAINTS,
  MOCK_PENDING_COACHES,
  MOCK_SESSION_LOGS,
  MOCK_SUBSCRIPTION_TIERS,
} from '@/data/roleSeed';
import {
  MOCK_CALENDAR,
  MOCK_CALENDAR_BLOCKS,
  MOCK_CLIENTS,
  MOCK_COACH,
  MOCK_EARNINGS,
  MOCK_FEEDBACK,
  MOCK_INVITES,
  MOCK_MESSAGES,
  MOCK_NOTIFICATIONS,
  MOCK_PROFILE,
  MOCK_PROGRAMS,
  MOCK_SESSION_HISTORY,
  MOCK_THREADS,
  MOCK_TODAY,
} from '@/data/seed';
import type {
  AuditLogEntry,
  BodyMetricEntry,
  Client,
  ClientPaymentRecord,
  ClientProfile,
  ClientWorkout,
  CoachClientAssignment,
  FeedbackItem,
  GymCoachPayout,
  GymCoachProfile,
  GymOrganization,
  GymStaffMember,
  GymSummary,
  Message,
  OperatorComplaint,
  OutOfOfficeBlock,
  PendingCoach,
  ProgressPhoto,
  SessionHistoryItem,
  SessionCompletionLog,
  SubscriptionTier,
  Thread,
} from '@/services/types';

export interface AppStore {
  coach: typeof MOCK_COACH;
  clients: Client[];
  today: typeof MOCK_TODAY;
  calendar: typeof MOCK_CALENDAR;
  calendarBlocks: Record<string, OutOfOfficeBlock>;
  sessionHistory: SessionHistoryItem[];
  programs: typeof MOCK_PROGRAMS;
  threads: Thread[];
  messages: Record<string, Message[]>;
  feedback: FeedbackItem[];
  notifications: typeof MOCK_NOTIFICATIONS;
  invites: typeof MOCK_INVITES;
  earnings: typeof MOCK_EARNINGS;
  profile: typeof MOCK_PROFILE;
  pendingRegistration: boolean;
  clientProfile: ClientProfile;
  clientWorkout: ClientWorkout;
  bodyMetrics: BodyMetricEntry[];
  sessionLogs: SessionCompletionLog[];
  pendingCoaches: PendingCoach[];
  assignments: CoachClientAssignment[];
  operatorComplaints: OperatorComplaint[];
  subscriptionTiers: SubscriptionTier[];
  auditLog: AuditLogEntry[];
  gym: GymSummary;
  gymCoaches: typeof MOCK_GYM_COACHES;
  gymStaff: GymStaffMember[];
  gymOrgs: GymOrganization[];
  gymCoachProfiles: GymCoachProfile[];
  clientPayments: ClientPaymentRecord[];
  gymCoachPayouts: GymCoachPayout[];
  progressPhotos: ProgressPhoto[];
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

export function createStore(): AppStore {
  return {
    coach: clone(MOCK_COACH),
    clients: clone(MOCK_CLIENTS),
    today: clone(MOCK_TODAY),
    calendar: clone(MOCK_CALENDAR),
    calendarBlocks: clone(MOCK_CALENDAR_BLOCKS),
    sessionHistory: clone(MOCK_SESSION_HISTORY),
    programs: clone([...MOCK_PROGRAMS, ...MOCK_GYM_PROGRAMS]),
    threads: clone(MOCK_THREADS),
    messages: clone(MOCK_MESSAGES),
    feedback: clone(MOCK_FEEDBACK),
    notifications: clone(MOCK_NOTIFICATIONS),
    invites: clone(MOCK_INVITES),
    earnings: clone(MOCK_EARNINGS),
    profile: clone(MOCK_PROFILE),
    pendingRegistration: false,
    clientProfile: clone(MOCK_CLIENT_PROFILE),
    clientWorkout: clone(MOCK_CLIENT_WORKOUT),
    bodyMetrics: clone(MOCK_BODY_METRICS),
    sessionLogs: clone(MOCK_SESSION_LOGS),
    pendingCoaches: clone(MOCK_PENDING_COACHES),
    assignments: clone(MOCK_ASSIGNMENTS),
    operatorComplaints: clone(MOCK_OPERATOR_COMPLAINTS),
    subscriptionTiers: clone(MOCK_SUBSCRIPTION_TIERS),
    auditLog: clone(MOCK_AUDIT_LOG),
    gym: clone(MOCK_GYM),
    gymCoaches: clone(MOCK_GYM_COACHES),
    gymStaff: clone(MOCK_GYM_STAFF),
    gymOrgs: clone(MOCK_GYM_ORGS),
    gymCoachProfiles: clone(MOCK_GYM_COACH_PROFILES),
    clientPayments: clone(MOCK_CLIENT_PAYMENTS),
    gymCoachPayouts: clone(MOCK_GYM_COACH_PAYOUTS),
    progressPhotos: [],
  };
}

let store = createStore();

export function getStore(): AppStore {
  return store;
}

export function resetStore(): void {
  store = createStore();
}

export function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
