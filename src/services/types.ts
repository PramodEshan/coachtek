export type RoleKey = 'solo_coach' | 'gym_coach' | 'client' | 'gym_admin' | 'gym_staff' | 'operator' | 'superadmin';

export type CoachAffiliation = 'solo' | 'gym';
export type ClientMembership = 'solo' | 'gym';
export type TenantStatus = 'pending' | 'active' | 'suspended' | 'deactivated';
export type ComplaintScope = 'platform' | 'gym' | 'solo_coach';

export type Tint =
  | 'sage' | 'clay' | 'sky' | 'lilac' | 'amber' | 'rose' | 'teal' | 'stone';

export type MonthlyPaymentStatus = 'paid' | 'unpaid';
export type ClientStatus = 'active' | 'archived';
export type SessionState = 'done' | 'ongoing' | 'upcoming' | 'ended';
export type FeedbackStatus = 'open' | 'replied' | 'resolved';
export type ActivityRange = '7d' | '30d' | '90d' | '6mo';
export type ArchiveReason = 'left_platform' | 'injury' | 'non_payment' | 'completed' | 'other';
export type ReassignReason = 'workload balance' | 'coach unavailability' | 'client issue' | 'other';

export interface CoachUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: RoleKey;
  gymId?: string;
  affiliation?: CoachAffiliation;
}

export type PlatformUser = CoachUser;

export interface Client {
  id: string;
  name: string;
  initials: string;
  tint: Tint;
  program: string;
  programCompletion: number;
  monthlyPayment: MonthlyPaymentStatus;
  streak: number;
  status: ClientStatus;
  timezone: string;
  tenure: string;
  joined: string;
  age?: number;
  tier?: string;
  membership?: ClientMembership;
  gymId?: string;
  soloCoachId?: string;
  phone?: string;
  archiveReason?: ArchiveReason;
}

export interface TodaySession {
  id: string;
  time: string;
  endTime: string;
  title: string;
  who: string;
  clientId: string;
  state: SessionState;
}

export interface CalSession {
  id: string;
  time: string;
  title: string;
  who: string;
  clientId: string;
  mode: string;
}

export type OutOfOfficeReason = 'Personal' | 'Sick' | 'Holiday' | 'Other';

export interface OutOfOfficeBlock {
  iso: string;
  reason: OutOfOfficeReason;
}

export interface SessionHistoryItem {
  id: string;
  clientId: string;
  date: string;
  title: string;
  duration: string;
  exerciseCount: number;
  note?: string;
}

export type ProgramSource = 'solo_coach' | 'gym';

export interface ProgramExercise {
  id: string;
  catalogId?: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface ProgramDay {
  day: string;
  label: string;
  exercises: ProgramExercise[];
}

export interface Program {
  id: string;
  name: string;
  tag: string;
  weeks: number;
  days: number;
  assigned: number;
  color: Tint;
  price: string;
  priceLabel: string;
  desc: string;
  coverUrl?: string;
  structure: ProgramDay[];
  source: ProgramSource;
  gymId?: string;
  soloCoachId?: string;
  /** Gym programs: coaches the gym admin has assigned to deliver this package. */
  assignedCoachIds?: string[];
}

export interface Thread {
  id: string;
  clientId: string;
  name: string;
  initials: string;
  tint: Tint;
  preview: string;
  time: string;
  unread: number;
  pinned: boolean;
}

export interface Message {
  id: string;
  from: 'coach' | 'client';
  t: string;
  text: string;
}

export interface FeedbackItem {
  id: string;
  clientId: string;
  clientName: string;
  subject: string;
  body: string;
  date: string;
  status: FeedbackStatus;
  replies: { from: 'coach' | 'client'; text: string; at: string }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  sub: string;
}

export interface InviteLink {
  id: string;
  label: string;
  program: string;
  uses: number;
  created: string;
}

export interface PendingPayout {
  id: string;
  amount: number;
  scheduledDate: string;
  label: string;
  status: 'scheduled' | 'processing';
}

export interface Earnings {
  thisMonth: number;
  lastMonth: number;
  pending: number;
  collected: number;
  currency: string;
  monthLabel: string;
  payoutDate: string;
  bankAccount: string;
  sessionRate: number;
  history: { month: string; amount: number; date: string; clients: number }[];
  pendingPayouts: PendingPayout[];
}

export interface CoachProfile {
  photoUrl: string;
  tagline: string;
  intro: string;
  details: { key: string; label: string; value: string }[];
  socials: { key: string; label: string; url: string }[];
  certifications: { name: string; issuer: string; year: string }[];
  stats: { key: string; label: string; value: string }[];
  whatsappBusinessNumber?: string;
  email?: string;
}

export interface ActivityPoint {
  label: string;
  steps: number;
  minutes: number;
  workouts: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  specialty?: string;
}

export interface ClientFilter {
  status?: ClientStatus;
  query?: string;
}

export type OperatorComplaintStatus = 'new' | 'in_review' | 'resolved' | 'escalated';
export type VettingStatus = 'pending' | 'approved' | 'rejected';

export interface ClientProfile {
  userId: string;
  coachId: string;
  coachName: string;
  program: string;
  streak: number;
  lastCheckIn: string;
  todayWorkoutStatus: 'pending' | 'complete';
  weight?: number;
  height?: string;
  goals?: string;
  emergencyContact?: string;
  healthConditions?: string;
  parqComplete: boolean;
  legalAccepted: boolean;
  onboardingComplete: boolean;
  subscriptionStatus: 'active' | 'paused' | 'cancelled';
  renewalDate: string;
  membership?: ClientMembership;
  gymId?: string;
  soloCoachId?: string;
  paymentPayee?: 'gym' | 'solo_coach';
  paymentPayeeName?: string;
  whatsappNumber?: string;
  whatsappOptIn?: boolean;
  email?: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface ClientWorkout {
  id: string;
  title: string;
  date: string;
  exercises: WorkoutExercise[];
  coachNote?: string;
  completed?: boolean;
}

export type SessionFeeling = 'great' | 'good' | 'okay' | 'tough' | 'exhausted';

export interface ExerciseLogEntry {
  exerciseId: string;
  name: string;
  reps?: string;
  weightKg?: string;
  time?: string;
}

export interface SessionCompletionLog {
  id: string;
  clientId: string;
  workoutId: string;
  date: string;
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
  weightKg: number;
  feeling: SessionFeeling;
  comment?: string;
  exerciseLogs?: ExerciseLogEntry[];
  coachNote?: string;
}

export interface ProgressPhoto {
  id: string;
  clientId: string;
  date: string;
  dataUrl: string;
  note?: string;
}

export interface OperatorFinancialOverview {
  activeSubscriptions: number;
  expiringSoon: number;
  failedPayments: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
}

export interface ProgramCreateInput {
  name: string;
  tag: string;
  weeks: number;
  days: number;
  price: string;
  priceLabel: string;
  desc: string;
  structure: ProgramDay[];
}

export interface ClientWeeklyParticipation {
  label: string;
  completed: number;
  scheduled: number;
}

export interface ClientProgressSummary {
  participationRate: number;
  sessionsCompleted: number;
  sessionsScheduled: number;
  currentStreak: number;
  totalCaloriesBurned: number;
  avgSessionMinutes: number;
  weightChangeKg: number;
  latestWeightKg: number;
  recentSessions: SessionCompletionLog[];
  weeklyParticipation: ClientWeeklyParticipation[];
}

export interface CompleteWorkoutInput {
  durationMinutes: number;
  caloriesBurned: number;
  weightKg: number;
  feeling: SessionFeeling;
  comment?: string;
  exerciseLogs?: ExerciseLogEntry[];
}

export interface BodyMetricEntry {
  date: string;
  weight: number;
  chest?: number;
  waist?: number;
}

export interface PendingCoach {
  id: string;
  name: string;
  email: string;
  submitted: string;
  certStatus: 'submitted' | 'missing';
  specialty: string;
  vettingStatus: VettingStatus;
  coachType?: 'solo_coach' | 'gym_coach';
}

export interface CoachClientAssignment {
  id: string;
  coachId: string;
  coachName: string;
  clientId: string;
  clientName: string;
  assignedDate: string;
  status: 'active' | 'ended';
  gymId?: string;
}

export interface OperatorComplaint {
  id: string;
  submitterName: string;
  submitterRole: 'client' | 'coach';
  type: 'coach' | 'platform' | 'billing';
  subject: string;
  body: string;
  date: string;
  status: OperatorComplaintStatus;
  internalNotes: string[];
  scope?: ComplaintScope;
  gymId?: string;
  soloCoachId?: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  clientLimit: number;
  registrationFee: number;
  monthlyFee: number;
}

export interface AuditLogEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
}

export interface GymSummary {
  id: string;
  name: string;
  activeCoaches: number;
  activeClients: number;
  sessionsThisWeek: number;
  revenueSnapshot: string;
}

export interface DashboardTrendPoint {
  label: string;
  value: number;
}

export interface GymStaffDashboardSummary {
  gymName: string;
  attendedToday: number;
  inGymNow: number;
  expectedToday: number;
  attendanceRate: number;
  checkInsPending: number;
  unpaidPayments: number;
  weeklyAttendance: DashboardTrendPoint[];
}

export interface GymAdminDashboardSummary {
  gymName: string;
  activeClients: number;
  activeCoaches: number;
  clientGrowthPct: number;
  coachGrowthPct: number;
  paymentGrowthPct: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  clientTrend: DashboardTrendPoint[];
  coachTrend: DashboardTrendPoint[];
  paymentTrend: DashboardTrendPoint[];
}

export interface OperatorDashboardSummary {
  pendingOnboarding: number;
  pendingSoloCoaches: number;
  pendingGyms: number;
  activeClients: number;
  openComplaints: number;
  newRegistrations7d: number;
  onboardingTrend: DashboardTrendPoint[];
  registrationTrend: DashboardTrendPoint[];
}

export interface SuperAdminDashboardSummary {
  platformRevenue: number;
  revenueGrowthPct: number;
  soloCoachCount: number;
  soloCoachGrowthPct: number;
  gymCount: number;
  gymGrowthPct: number;
  clientCount: number;
  clientGrowthPct: number;
  revenueTrend: DashboardTrendPoint[];
  soloCoachTrend: DashboardTrendPoint[];
  gymTrend: DashboardTrendPoint[];
  clientTrend: DashboardTrendPoint[];
}

export interface GymStaffMember {
  id: string;
  name: string;
  email: string;
  role: 'gym_staff';
}

export interface GymOrganization {
  id: string;
  name: string;
  location?: string;
  status: TenantStatus;
  subscriptionPlan?: string;
  registeredBy?: string;
  registeredAt?: string;
  primaryAdminEmail?: string;
  activeCoaches: number;
  activeClients: number;
}

export interface ClientPaymentRecord {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  payeeType: 'gym' | 'solo_coach';
  payeeId: string;
  payeeName: string;
  gymId?: string;
  soloCoachId?: string;
}

export interface GymCoachPayout {
  id: string;
  gymCoachId: string;
  gymCoachName: string;
  gymId: string;
  period: string;
  amount: number;
  status: 'paid' | 'pending' | 'processing';
  paidDate?: string;
}

export interface GymCoachProfile {
  id: string;
  name: string;
  email: string;
  gymId: string;
  gymName: string;
  specialty: string;
  status: TenantStatus;
  clients: number;
}
