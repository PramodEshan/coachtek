import type {
  AuditLogEntry,
  BodyMetricEntry,
  ClientPaymentRecord,
  ClientProfile,
  ClientWorkout,
  CoachClientAssignment,
  CoachUser,
  GymCoachPayout,
  GymCoachProfile,
  GymOrganization,
  GymStaffMember,
  GymSummary,
  OperatorComplaint,
  PendingCoach,
  Program,
  SessionCompletionLog,
  SubscriptionTier,
} from '@/services/types';

export const DEMO_PASSWORD = 'demo123';

export const MOCK_USERS: Record<string, CoachUser> = {
  'alex@coachtek.app': {
    id: 'coach-1',
    name: 'Alex Morgan',
    email: 'alex@coachtek.app',
    initials: 'AM',
    role: 'solo_coach',
    affiliation: 'solo',
  },
  'priya@coachtek.app': {
    id: 'coach-2',
    name: 'Priya Sharma',
    email: 'priya@coachtek.app',
    initials: 'PS',
    role: 'solo_coach',
    affiliation: 'solo',
  },
  'jordan@client.demo': {
    id: 'client-user-1',
    name: 'Jordan Lee',
    email: 'jordan@client.demo',
    initials: 'JL',
    role: 'client',
  },
  'ops@coachtek.app': {
    id: 'operator-1',
    name: 'Sam Operator',
    email: 'ops@coachtek.app',
    initials: 'SO',
    role: 'operator',
  },
  'gym@coachtek.app': {
    id: 'gym-admin-1',
    name: 'Riley Gym Admin',
    email: 'gym@coachtek.app',
    initials: 'RG',
    role: 'gym_admin',
    gymId: 'gym-1',
  },
  'staff@gym.demo': {
    id: 'gym-staff-1',
    name: 'Casey Staff',
    email: 'staff@gym.demo',
    initials: 'CS',
    role: 'gym_staff',
    gymId: 'gym-1',
  },
  'gymcoach@gym.demo': {
    id: 'gym-coach-1',
    name: 'Marcus Webb',
    email: 'gymcoach@gym.demo',
    initials: 'MW',
    role: 'gym_coach',
    gymId: 'gym-1',
    affiliation: 'gym',
  },
  'admin@coachtek.app': {
    id: 'superadmin-1',
    name: 'Taylor Admin',
    email: 'admin@coachtek.app',
    initials: 'TA',
    role: 'superadmin',
  },
};

export const MOCK_CLIENT_PROFILE: ClientProfile = {
  userId: 'client-user-1',
  coachId: 'coach-1',
  coachName: 'Alex Morgan',
  program: 'Strength 12',
  streak: 14,
  lastCheckIn: '2026-06-21',
  todayWorkoutStatus: 'pending',
  weight: 78,
  height: '5\'11"',
  goals: 'Build strength, improve mobility',
  emergencyContact: 'Alex Lee · +1 555 0100',
  healthConditions: 'Minor lower-back tightness',
  parqComplete: true,
  legalAccepted: true,
  onboardingComplete: true,
  subscriptionStatus: 'active',
  renewalDate: '28 Jul 2026',
  membership: 'solo',
  soloCoachId: 'coach-1',
  paymentPayee: 'solo_coach',
  paymentPayeeName: 'Alex Morgan',
  whatsappNumber: '+1555010142',
  whatsappOptIn: true,
  email: 'jordan@client.demo',
};

export const MOCK_CLIENT_WORKOUT: ClientWorkout = {
  id: 'cw1',
  title: 'Lower body strength',
  date: '2026-06-22',
  coachNote: 'Focus on depth and controlled tempo on squats.',
  exercises: [
    { id: 'e1', name: 'Back squat', sets: 4, reps: '6', rest: '90s' },
    { id: 'e2', name: 'Romanian deadlift', sets: 3, reps: '10', rest: '60s' },
    { id: 'e3', name: 'Walking lunges', sets: 3, reps: '12/leg', rest: '45s' },
  ],
};

export const MOCK_SESSION_LOGS: SessionCompletionLog[] = [
  { id: 'sl1', clientId: 'client-user-1', workoutId: 'w1', date: '2026-06-02', title: 'Upper push', durationMinutes: 52, caloriesBurned: 310, weightKg: 79.2, feeling: 'good' },
  { id: 'sl2', clientId: 'client-user-1', workoutId: 'w2', date: '2026-06-04', title: 'Lower strength', durationMinutes: 58, caloriesBurned: 380, weightKg: 79.0, feeling: 'tough' },
  { id: 'sl3', clientId: 'client-user-1', workoutId: 'w3', date: '2026-06-06', title: 'Conditioning', durationMinutes: 35, caloriesBurned: 420, weightKg: 78.9, feeling: 'great' },
  { id: 'sl4', clientId: 'client-user-1', workoutId: 'w4', date: '2026-06-09', title: 'Upper pull', durationMinutes: 48, caloriesBurned: 295, weightKg: 78.8, feeling: 'good' },
  { id: 'sl5', clientId: 'client-user-1', workoutId: 'w5', date: '2026-06-11', title: 'Lower strength', durationMinutes: 55, caloriesBurned: 365, weightKg: 78.7, feeling: 'good' },
  { id: 'sl6', clientId: 'client-user-1', workoutId: 'w6', date: '2026-06-13', title: 'Mobility', durationMinutes: 30, caloriesBurned: 180, weightKg: 78.6, feeling: 'okay' },
  { id: 'sl7', clientId: 'client-user-1', workoutId: 'w7', date: '2026-06-16', title: 'Upper push', durationMinutes: 50, caloriesBurned: 305, weightKg: 78.5, feeling: 'good' },
  { id: 'sl8', clientId: 'client-user-1', workoutId: 'w8', date: '2026-06-18', title: 'Lower strength', durationMinutes: 57, caloriesBurned: 390, weightKg: 78.3, feeling: 'tough' },
  { id: 'sl9', clientId: 'client-user-1', workoutId: 'w9', date: '2026-06-20', title: 'Conditioning', durationMinutes: 38, caloriesBurned: 410, weightKg: 78.1, feeling: 'great' },
  { id: 'sl10', clientId: 'client-user-1', workoutId: 'w10', date: '2026-06-21', title: 'Active recovery', durationMinutes: 25, caloriesBurned: 150, weightKg: 78.0, feeling: 'okay' },
];

export const MOCK_BODY_METRICS: BodyMetricEntry[] = [
  { date: '2026-06-01', weight: 79.2, chest: 102, waist: 84 },
  { date: '2026-06-08', weight: 78.8, chest: 102, waist: 83 },
  { date: '2026-06-15', weight: 78.4, chest: 103, waist: 82 },
  { date: '2026-06-22', weight: 78.0, chest: 103, waist: 82 },
];

export const MOCK_PENDING_COACHES: PendingCoach[] = [
  {
    id: 'pc1',
    name: 'Morgan Chen',
    email: 'morgan@coach.demo',
    submitted: '2026-06-18',
    certStatus: 'submitted',
    specialty: 'Strength & conditioning',
    vettingStatus: 'pending',
    coachType: 'solo_coach',
  },
  {
    id: 'pc2',
    name: 'Jamie Ortiz',
    email: 'jamie@coach.demo',
    submitted: '2026-06-20',
    certStatus: 'missing',
    specialty: 'Hypertrophy',
    vettingStatus: 'pending',
    coachType: 'solo_coach',
  },
];

export const MOCK_ASSIGNMENTS: CoachClientAssignment[] = [
  { id: 'a1', coachId: 'coach-1', coachName: 'Alex Morgan', clientId: 'c1', clientName: 'Jordan Lee', assignedDate: '2025-08-01', status: 'active' },
  { id: 'a2', coachId: 'coach-1', coachName: 'Alex Morgan', clientId: 'c2', clientName: 'Sam Rivera', assignedDate: '2026-02-01', status: 'active' },
  { id: 'a3', coachId: 'coach-1', coachName: 'Alex Morgan', clientId: 'c3', clientName: 'Taylor Brooks', assignedDate: '2026-04-01', status: 'active' },
  { id: 'a4', coachId: 'coach-1', coachName: 'Alex Morgan', clientId: 'c4', clientName: 'Morgan Chen', assignedDate: '2025-07-01', status: 'active' },
];

export const MOCK_OPERATOR_COMPLAINTS: OperatorComplaint[] = [
  {
    id: 'oc1',
    submitterName: 'Taylor Brooks',
    submitterRole: 'client',
    type: 'coach',
    subject: 'Session reschedule confusion',
    body: 'My session was moved without clear notice.',
    date: '2026-06-19',
    status: 'new',
    internalNotes: [],
    scope: 'solo_coach',
    soloCoachId: 'coach-1',
  },
  {
    id: 'oc2',
    submitterName: 'Sam Rivera',
    submitterRole: 'client',
    type: 'billing',
    subject: 'Double charge on subscription',
    body: 'I was charged twice this month.',
    date: '2026-06-17',
    status: 'in_review',
    internalNotes: ['Requested payment provider log'],
    scope: 'platform',
  },
  {
    id: 'oc3',
    submitterName: 'Alex Morgan',
    submitterRole: 'coach',
    type: 'platform',
    subject: 'Calendar sync issue',
    body: 'Blocked dates still showing sessions.',
    date: '2026-06-15',
    status: 'escalated',
    internalNotes: ['Escalated to engineering'],
    scope: 'platform',
  },
  {
    id: 'oc4',
    submitterName: 'Liam Patel',
    submitterRole: 'client',
    type: 'coach',
    subject: 'Gym coach not responding',
    body: 'Tried to reach my coach multiple times with no reply.',
    date: '2026-06-22',
    status: 'new',
    internalNotes: [],
    scope: 'gym',
    gymId: 'gym-1',
  },
];

export const MOCK_SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  { id: 't1', name: '1-on-1 Starter', clientLimit: 10, registrationFee: 49, monthlyFee: 50 },
  { id: 't2', name: '1-on-1 Growth', clientLimit: 25, registrationFee: 99, monthlyFee: 50 },
  { id: 't3', name: '1-on-1 Pro', clientLimit: 50, registrationFee: 149, monthlyFee: 50 },
  { id: 't4', name: '1-on-1 Elite', clientLimit: 999, registrationFee: 0, monthlyFee: 50 },
];

export const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  { id: 'al1', at: '2026-06-20 14:22', actor: 'Sam Operator', action: 'Reassigned client', detail: 'Taylor Brooks → Alex Morgan (workload balance)' },
  { id: 'al2', at: '2026-06-19 09:10', actor: 'Sam Operator', action: 'Rejected coach', detail: 'Jamie Ortiz — missing certification' },
  { id: 'al3', at: '2026-06-18 16:45', actor: 'Sam Operator', action: 'Escalated complaint', detail: 'oc3 → Super Admin review' },
];

export const MOCK_GYM: GymSummary = {
  id: 'gym-1',
  name: 'Iron District Fitness',
  activeCoaches: 3,
  activeClients: 24,
  sessionsThisWeek: 18,
  revenueSnapshot: '£4,820',
};

export const MOCK_GYM_ORGS: GymOrganization[] = [
  { id: 'gym-1', name: 'Iron District Fitness', location: 'London, UK', status: 'active', subscriptionPlan: '1-on-1 Pro', registeredBy: 'operator-1', registeredAt: '2025-11-01', primaryAdminEmail: 'gym@coachtek.app', activeCoaches: 3, activeClients: 24 },
  { id: 'gym-2', name: 'Northside Athletics', location: 'Manchester, UK', status: 'active', subscriptionPlan: '1-on-1 Growth', registeredBy: 'operator-1', registeredAt: '2026-01-15', primaryAdminEmail: 'north@gym.demo', activeCoaches: 2, activeClients: 12 },
  { id: 'gym-3', name: 'Harbor Wellness', location: 'Bristol, UK', status: 'pending', subscriptionPlan: '1-on-1 Starter', registeredBy: 'operator-1', registeredAt: '2026-06-20', primaryAdminEmail: 'harbor@gym.demo', activeCoaches: 0, activeClients: 0 },
];

export const MOCK_GYM_STAFF: GymStaffMember[] = [
  { id: 'gs1', name: 'Casey Staff', email: 'staff@gym.demo', role: 'gym_staff' },
  { id: 'gs2', name: 'Dana Front Desk', email: 'dana@gym.demo', role: 'gym_staff' },
];

/** Gym-owned monthly packages — coaches only see programs assigned to them. */
export const MOCK_GYM_PROGRAMS: Program[] = [
  {
    id: 'gym-p1',
    name: 'Iron Strength Monthly',
    tag: 'Strength',
    weeks: 4,
    days: 4,
    assigned: 8,
    color: 'sage',
    price: '£120',
    priceLabel: 'per month',
    desc: 'Gym standard strength block. Assigned by gym admin to eligible coaches.',
    source: 'gym',
    gymId: 'gym-1',
    assignedCoachIds: ['gym-coach-1', 'gym-coach-2'],
    coverUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    structure: [
      { day: 'Day 1', label: 'Lower', exercises: [
        { id: 'gpex-1', name: 'Back squat', sets: 4, reps: '6', rest: '120s' },
        { id: 'gpex-2', name: 'Romanian deadlift', sets: 3, reps: '10', rest: '90s' },
        { id: 'gpex-3', name: 'Walking lunges', sets: 3, reps: '12/leg', rest: '45s' },
      ] },
      { day: 'Day 2', label: 'Upper', exercises: [
        { id: 'gpex-4', name: 'Bench press', sets: 4, reps: '6', rest: '120s' },
        { id: 'gpex-5', name: 'Barbell row', sets: 4, reps: '8', rest: '90s' },
        { id: 'gpex-6', name: 'Face pull', sets: 3, reps: '15', rest: '30s' },
      ] },
    ],
  },
  {
    id: 'gym-p2',
    name: 'Mobility Plus',
    tag: 'Mobility',
    weeks: 4,
    days: 3,
    assigned: 5,
    color: 'sky',
    price: '£95',
    priceLabel: 'per month',
    desc: 'Recovery and movement quality package for gym members.',
    source: 'gym',
    gymId: 'gym-1',
    assignedCoachIds: ['gym-coach-2'],
    coverUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    structure: [
      { day: 'Day 1', label: 'Hips & spine', exercises: [
        { id: 'gpex-7', name: 'Hip 90/90 stretch', sets: 2, reps: '30s/side', rest: '—' },
        { id: 'gpex-8', name: 'Cat-cow', sets: 2, reps: '10', rest: '—' },
        { id: 'gpex-9', name: 'Band pull-apart', sets: 3, reps: '15', rest: '—' },
      ] },
    ],
  },
  {
    id: 'gym-p3',
    name: 'HIIT Fundamentals',
    tag: 'Conditioning',
    weeks: 4,
    days: 3,
    assigned: 6,
    color: 'clay',
    price: '£110',
    priceLabel: 'per month',
    desc: 'High-intensity conditioning template for gym floor sessions.',
    source: 'gym',
    gymId: 'gym-1',
    assignedCoachIds: ['gym-coach-1'],
    coverUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    structure: [
      { day: 'Day 1', label: 'Intervals', exercises: [
        { id: 'gpex-10', name: 'Assault bike', sets: 8, reps: '30s', rest: '30s' },
        { id: 'gpex-11', name: 'Kettlebell swing', sets: 4, reps: '15', rest: '45s' },
        { id: 'gpex-12', name: 'Burpees', sets: 3, reps: '10', rest: '45s' },
      ] },
    ],
  },
];

export const MOCK_GYM_COACHES = [
  { id: 'coach-1', name: 'Alex Morgan', clients: 4, status: 'active' },
  { id: 'coach-2', name: 'Morgan Chen', clients: 6, status: 'active' },
  { id: 'coach-3', name: 'Jamie Ortiz', clients: 3, status: 'pending' },
];

export const OPERATOR_DEMO_STATS = {
  activeCoaches: 12,
  activeClients: 48,
  pendingVetting: 2,
  openComplaints: 3,
  newRegistrations7d: 5,
};

export const SUPERADMIN_DEMO_STATS = {
  escalatedComplaints: 1,
  operators: 2,
  gyms: 4,
  tierChanges30d: 3,
};

export const MOCK_GYM_COACH_PROFILES: GymCoachProfile[] = [
  { id: 'gym-coach-1', name: 'Marcus Webb', email: 'gymcoach@gym.demo', gymId: 'gym-1', gymName: 'Iron District Fitness', specialty: 'Functional training', status: 'active', clients: 4 },
  { id: 'gym-coach-2', name: 'Elena Rossi', email: 'elena@gym.demo', gymId: 'gym-1', gymName: 'Iron District Fitness', specialty: 'Yoga & mobility', status: 'active', clients: 3 },
  { id: 'gym-coach-3', name: 'Kai Nakamura', email: 'kai@gym.demo', gymId: 'gym-2', gymName: 'Northside Athletics', specialty: 'HIIT', status: 'active', clients: 5 },
];

export const MOCK_CLIENT_PAYMENTS: ClientPaymentRecord[] = [
  { id: 'cp1', clientId: 'c1', clientName: 'Jordan Lee', amount: 120, date: '2026-06-01', status: 'paid', payeeType: 'solo_coach', payeeId: 'coach-1', payeeName: 'Alex Morgan', soloCoachId: 'coach-1' },
  { id: 'cp2', clientId: 'c1', clientName: 'Jordan Lee', amount: 120, date: '2026-05-01', status: 'paid', payeeType: 'solo_coach', payeeId: 'coach-1', payeeName: 'Alex Morgan', soloCoachId: 'coach-1' },
  { id: 'cp2b', clientId: 'c2', clientName: 'Sam Rivera', amount: 120, date: '2026-06-01', status: 'pending', payeeType: 'solo_coach', payeeId: 'coach-1', payeeName: 'Alex Morgan', soloCoachId: 'coach-1' },
  { id: 'cp2c', clientId: 'c4', clientName: 'Morgan Chen', amount: 120, date: '2026-06-01', status: 'paid', payeeType: 'solo_coach', payeeId: 'coach-1', payeeName: 'Alex Morgan', soloCoachId: 'coach-1' },
  { id: 'cp3', clientId: 'c3', clientName: 'Taylor Brooks', amount: 85, date: '2026-06-01', status: 'pending', payeeType: 'gym', payeeId: 'gym-1', payeeName: 'Iron District Fitness', gymId: 'gym-1' },
  { id: 'cp3b', clientId: 'c3', clientName: 'Taylor Brooks', amount: 85, date: '2026-05-01', status: 'paid', payeeType: 'gym', payeeId: 'gym-1', payeeName: 'Iron District Fitness', gymId: 'gym-1' },
  { id: 'cp4', clientId: 'gym-client-1', clientName: 'Liam Patel', amount: 85, date: '2026-06-01', status: 'paid', payeeType: 'gym', payeeId: 'gym-1', payeeName: 'Iron District Fitness', gymId: 'gym-1' },
  { id: 'cp5', clientId: 'gym-client-2', clientName: 'Nadia Okafor', amount: 85, date: '2026-06-01', status: 'paid', payeeType: 'gym', payeeId: 'gym-1', payeeName: 'Iron District Fitness', gymId: 'gym-1' },
  { id: 'cp6', clientId: 'gym-client-1', clientName: 'Liam Patel', amount: 85, date: '2026-05-01', status: 'paid', payeeType: 'gym', payeeId: 'gym-1', payeeName: 'Iron District Fitness', gymId: 'gym-1' },
  { id: 'cp7', clientId: 'client-user-1', clientName: 'Jordan Lee', amount: 120, date: '2026-06-01', status: 'paid', payeeType: 'solo_coach', payeeId: 'coach-1', payeeName: 'Alex Morgan', soloCoachId: 'coach-1' },
];

export const MOCK_GYM_COACH_PAYOUTS: GymCoachPayout[] = [
  { id: 'gp1', gymCoachId: 'gym-coach-1', gymCoachName: 'Marcus Webb', gymId: 'gym-1', period: 'June 2026', amount: 2400, status: 'pending' },
  { id: 'gp2', gymCoachId: 'gym-coach-2', gymCoachName: 'Elena Rossi', gymId: 'gym-1', period: 'June 2026', amount: 1800, status: 'pending' },
  { id: 'gp3', gymCoachId: 'gym-coach-1', gymCoachName: 'Marcus Webb', gymId: 'gym-1', period: 'May 2026', amount: 2400, status: 'paid', paidDate: '2026-05-28' },
  { id: 'gp4', gymCoachId: 'gym-coach-3', gymCoachName: 'Kai Nakamura', gymId: 'gym-2', period: 'June 2026', amount: 2100, status: 'processing' },
];

export const MOCK_GYM_CLIENTS: ClientPaymentRecord[] = MOCK_CLIENT_PAYMENTS.filter(p => p.gymId);

export const OPERATOR_DEMO_STATS_V2 = {
  activeSoloCoaches: 2,
  pendingSoloCoaches: 2,
  registeredGyms: 3,
  pendingGyms: 1,
  activeClients: 48,
  openComplaints: 3,
  newRegistrations7d: 5,
};
