import type {
  ActivityPoint,
  CalSession,
  Client,
  CoachProfile,
  CoachUser,
  Earnings,
  FaqItem,
  FeedbackItem,
  InviteLink,
  Message,
  NotificationItem,
  Program,
  SessionHistoryItem,
  Thread,
  TodaySession,
} from '@/services/types';

export const MOCK_COACH: CoachUser = {
  id: 'coach-1',
  name: 'Alex Morgan',
  email: 'alex@coachtek.app',
  initials: 'AM',
  role: 'solo_coach',
};

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Jordan Lee',
    initials: 'JL',
    tint: 'sage',
    program: 'Strength 12',
    programCompletion: 92,
    monthlyPayment: 'paid',
    streak: 14,
    status: 'active',
    timezone: 'America/New_York',
    tenure: '8 months',
    joined: 'Aug 2025',
    age: 32,
    tier: 'Premium',
    membership: 'solo',
    soloCoachId: 'coach-1',
    phone: '+1555010142',
  },
  {
    id: 'c2',
    name: 'Sam Rivera',
    initials: 'SR',
    tint: 'clay',
    program: 'Hypertrophy 8',
    programCompletion: 78,
    monthlyPayment: 'unpaid',
    streak: 6,
    status: 'active',
    timezone: 'America/Chicago',
    tenure: '4 months',
    joined: 'Feb 2026',
    age: 28,
    tier: 'Standard',
    membership: 'solo',
    soloCoachId: 'coach-1',
    phone: '+1555010242',
  },
  {
    id: 'c3',
    name: 'Taylor Brooks',
    initials: 'TB',
    tint: 'sky',
    program: 'Mobility 6',
    programCompletion: 65,
    monthlyPayment: 'unpaid',
    streak: 2,
    status: 'active',
    timezone: 'America/Los_Angeles',
    tenure: '2 months',
    joined: 'Apr 2026',
    age: 41,
    tier: 'Standard',
    membership: 'gym',
    gymId: 'gym-1',
  },
  {
    id: 'c4',
    name: 'Morgan Chen',
    initials: 'MC',
    tint: 'lilac',
    program: 'Strength 12',
    programCompletion: 88,
    monthlyPayment: 'paid',
    streak: 21,
    status: 'active',
    timezone: 'Europe/London',
    tenure: '11 months',
    joined: 'Jul 2025',
    age: 35,
    tier: 'Premium',
    membership: 'solo',
    soloCoachId: 'coach-1',
  },
  {
    id: 'c5',
    name: 'Riley Park',
    initials: 'RP',
    tint: 'amber',
    program: 'Hypertrophy 8',
    programCompletion: 45,
    monthlyPayment: 'unpaid',
    streak: 0,
    status: 'archived',
    timezone: 'America/Denver',
    tenure: '3 months',
    joined: 'Mar 2026',
    age: 26,
    tier: 'Standard',
    membership: 'solo',
    soloCoachId: 'coach-1',
  },
  {
    id: 'gym-client-1',
    name: 'Liam Patel',
    initials: 'LP',
    tint: 'teal',
    program: 'Gym strength',
    programCompletion: 71,
    monthlyPayment: 'paid',
    streak: 9,
    status: 'active',
    timezone: 'Europe/London',
    tenure: '5 months',
    joined: 'Jan 2026',
    age: 29,
    tier: 'Standard',
    membership: 'gym',
    gymId: 'gym-1',
  },
  {
    id: 'gym-client-2',
    name: 'Nadia Okafor',
    initials: 'NO',
    tint: 'rose',
    program: 'Gym conditioning',
    programCompletion: 58,
    monthlyPayment: 'paid',
    streak: 4,
    status: 'active',
    timezone: 'Europe/London',
    tenure: '3 months',
    joined: 'Mar 2026',
    age: 34,
    tier: 'Standard',
    membership: 'gym',
    gymId: 'gym-1',
  },
];

export const COACH_DAILY_SLOT_CAPACITY = 6;

export const MOCK_TODAY: TodaySession[] = [
  {
    id: 's0',
    time: '07:30',
    endTime: '08:00',
    title: 'Check-in call',
    who: 'Riley Park',
    clientId: 'c5',
    state: 'ended',
  },
  {
    id: 's1',
    time: '09:00',
    endTime: '09:55',
    title: 'Lower body strength',
    who: 'Jordan Lee',
    clientId: 'c1',
    state: 'done',
  },
  {
    id: 's2',
    time: '11:30',
    endTime: '12:20',
    title: 'Upper push',
    who: 'Sam Rivera',
    clientId: 'c2',
    state: 'ongoing',
  },
  {
    id: 's3',
    time: '15:00',
    endTime: '15:40',
    title: 'Mobility flow',
    who: 'Taylor Brooks',
    clientId: 'c3',
    state: 'upcoming',
  },
];

export const MOCK_CALENDAR: Record<string, CalSession[]> = {
  '2026-06-20': [
    { id: 'cal-0620-0', time: '10:00', title: 'Full body', who: 'Morgan Chen', clientId: 'c4', mode: 'Video' },
  ],
  '2026-06-21': [
    { id: 'cal-0621-0', time: '09:00', title: 'Lower body', who: 'Jordan Lee', clientId: 'c1', mode: 'In person' },
  ],
  '2026-06-22': [
    { id: 'cal-0622-0', time: '09:00', title: 'Lower body strength', who: 'Jordan Lee', clientId: 'c1', mode: 'In person' },
    { id: 'cal-0622-1', time: '11:30', title: 'Upper push', who: 'Sam Rivera', clientId: 'c2', mode: 'Video' },
    { id: 'cal-0622-2', time: '15:00', title: 'Mobility flow', who: 'Taylor Brooks', clientId: 'c3', mode: 'Video' },
  ],
  '2026-06-23': [
    { id: 'cal-0623-0', time: '08:00', title: 'Conditioning', who: 'Morgan Chen', clientId: 'c4', mode: 'Video' },
  ],
  '2026-06-24': [],
  '2026-06-25': [
    { id: 'cal-0625-0', time: '12:00', title: 'Check-in call', who: 'Sam Rivera', clientId: 'c2', mode: 'Video' },
  ],
};

export const MOCK_CALENDAR_BLOCKS: Record<string, { iso: string; reason: 'Personal' | 'Sick' | 'Holiday' | 'Other' }> = {
  '2026-06-24': { iso: '2026-06-24', reason: 'Holiday' },
  '2026-06-27': { iso: '2026-06-27', reason: 'Personal' },
  '2026-06-28': { iso: '2026-06-28', reason: 'Sick' },
};

export const MOCK_SESSION_HISTORY: SessionHistoryItem[] = [
  {
    id: 'h1',
    clientId: 'c1',
    date: '2026-06-20',
    title: 'Lower body strength',
    duration: '55 min',
    exerciseCount: 8,
    note: 'Increased squat load by 5 kg. Form solid on RDL.',
  },
  {
    id: 'h2',
    clientId: 'c1',
    date: '2026-06-18',
    title: 'Upper pull',
    duration: '48 min',
    exerciseCount: 7,
    note: 'Pull-ups progressing well — added band assist reduction.',
  },
  {
    id: 'h3',
    clientId: 'c2',
    date: '2026-06-19',
    title: 'Upper push',
    duration: '50 min',
    exerciseCount: 6,
    note: 'Shoulder mobility warm-up helped bench comfort.',
  },
  {
    id: 'h4',
    clientId: 'c3',
    date: '2026-06-17',
    title: 'Mobility flow',
    duration: '40 min',
    exerciseCount: 5,
  },
  {
    id: 'h5',
    clientId: 'c4',
    date: '2026-06-21',
    title: 'Full body',
    duration: '60 min',
    exerciseCount: 9,
    note: 'Travel week — adjusted volume down 20%.',
  },
];

export const MOCK_PROGRAMS: Program[] = [
  {
    id: 'p1',
    name: 'Strength 12',
    tag: 'Strength',
    weeks: 12,
    days: 4,
    assigned: 2,
    color: 'sage',
    price: '£149',
    priceLabel: 'per month',
    desc: 'Progressive strength block with compound focus.',
    source: 'solo_coach',
    soloCoachId: 'coach-1',
    coverUrl:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    structure: [
      {
        day: 'Day 1',
        label: 'Lower',
        exercises: [
          { id: 'pex-s1', name: 'Back squat', sets: 4, reps: '5', rest: '120s' },
          { id: 'pex-s2', name: 'Romanian deadlift', sets: 3, reps: '8', rest: '90s' },
          { id: 'pex-s3', name: 'Leg press', sets: 3, reps: '10', rest: '90s' },
        ],
      },
      {
        day: 'Day 2',
        label: 'Upper push',
        exercises: [
          { id: 'pex-s4', name: 'Bench press', sets: 4, reps: '5', rest: '120s' },
          { id: 'pex-s5', name: 'Overhead press', sets: 3, reps: '8', rest: '90s' },
          { id: 'pex-s6', name: 'Dips', sets: 3, reps: '10', rest: '60s' },
        ],
      },
    ],
  },
  {
    id: 'p2',
    name: 'Hypertrophy 8',
    tag: 'Hypertrophy',
    weeks: 8,
    days: 5,
    assigned: 2,
    color: 'clay',
    price: '£129',
    priceLabel: 'per month',
    desc: 'Volume-focused split for muscle gain.',
    source: 'solo_coach',
    soloCoachId: 'coach-1',
    coverUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    structure: [
      {
        day: 'Day 1',
        label: 'Chest & triceps',
        exercises: [
          { id: 'pex-s7', name: 'Incline dumbbell press', sets: 4, reps: '10', rest: '60s' },
          { id: 'pex-s8', name: 'Cable fly', sets: 3, reps: '12', rest: '45s' },
          { id: 'pex-s9', name: 'Tricep pushdown', sets: 3, reps: '15', rest: '30s' },
        ],
      },
    ],
  },
  {
    id: 'p3',
    name: 'Mobility 6',
    tag: 'Mobility',
    weeks: 6,
    days: 3,
    assigned: 1,
    color: 'sky',
    price: '£89',
    priceLabel: 'per month',
    desc: 'Joint health and movement quality.',
    source: 'solo_coach',
    soloCoachId: 'coach-1',
    coverUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    structure: [
      {
        day: 'Day 1',
        label: 'Hips & spine',
        exercises: [
          { id: 'pex-s10', name: 'Hip 90/90 stretch', sets: 2, reps: '30s/side', rest: '—' },
          { id: 'pex-s11', name: 'Cat-cow', sets: 2, reps: '10', rest: '—' },
          { id: 'pex-s12', name: 'Hip 90/90 stretch', sets: 2, reps: '5/side', rest: '—' },
        ],
      },
    ],
  },
];

export const MOCK_THREADS: Thread[] = [
  {
    id: 't1',
    clientId: 'c1',
    name: 'Jordan Lee',
    initials: 'JL',
    tint: 'sage',
    preview: 'Thanks — squats felt great today.',
    time: '2h',
    unread: 1,
    pinned: true,
  },
  {
    id: 't2',
    clientId: 'c2',
    name: 'Sam Rivera',
    initials: 'SR',
    tint: 'clay',
    preview: 'Can we swap Friday for Saturday?',
    time: '5h',
    unread: 0,
    pinned: false,
  },
  {
    id: 't3',
    clientId: 'c3',
    name: 'Taylor Brooks',
    initials: 'TB',
    tint: 'sky',
    preview: 'Check-in form submitted.',
    time: '1d',
    unread: 0,
    pinned: false,
  },
  {
    id: 't4',
    clientId: 'c4',
    name: 'Morgan Chen',
    initials: 'MC',
    tint: 'lilac',
    preview: 'Travel week — can we shift Tuesday?',
    time: '2d',
    unread: 0,
    pinned: false,
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  t1: [
    { id: 'm1', from: 'client', t: '09:15', text: 'Morning! Ready for lower body.' },
    { id: 'm2', from: 'coach', t: '09:18', text: 'Great — we will focus on squat depth today.' },
    { id: 'm3', from: 'client', t: '10:45', text: 'Thanks — squats felt great today.' },
  ],
  t2: [
    { id: 'm4', from: 'client', t: '14:00', text: 'Can we swap Friday for Saturday?' },
    { id: 'm5', from: 'coach', t: '14:22', text: 'Saturday 10:00 works. I will update the calendar.' },
  ],
  t3: [
    { id: 'm6', from: 'client', t: 'Yesterday', text: 'Check-in form submitted.' },
  ],
  t4: [
    { id: 'm7', from: 'client', t: 'Mon', text: 'Travel week — can we shift Tuesday?' },
  ],
};

export const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: 'f1',
    clientId: 'c3',
    clientName: 'Taylor Brooks',
    subject: 'Session timing conflict',
    body: 'The last two sessions ran over and overlapped my work calls. Can we keep to 45 minutes?',
    date: '2026-06-19',
    status: 'open',
    replies: [],
  },
  {
    id: 'f2',
    clientId: 'c2',
    clientName: 'Sam Rivera',
    subject: 'Program clarity',
    body: 'Week 3 day 2 — not sure which accessory to pick from the list.',
    date: '2026-06-15',
    status: 'replied',
    replies: [
      {
        from: 'coach',
        text: 'Use cable row if bench is busy; same rep scheme applies.',
        at: '2026-06-15',
      },
    ],
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Check-in overdue', sub: 'Taylor Brooks — mobility week 2' },
  { id: 'n2', title: 'New message', sub: 'Jordan Lee replied to your note' },
  { id: 'n3', title: 'Payout scheduled', sub: '£2,340 on 28 Jun' },
];

export const MOCK_INVITES: InviteLink[] = [
  { id: 'i1', label: 'Strength 12 — open', program: 'Strength 12', uses: 3, created: 'Jun 1' },
  { id: 'i2', label: 'Hypertrophy waitlist', program: 'Hypertrophy 8', uses: 0, created: 'Jun 10' },
];

export const MOCK_EARNINGS: Earnings = {
  thisMonth: 2340,
  lastMonth: 2180,
  pending: 420,
  collected: 1920,
  currency: '£',
  monthLabel: 'June 2026',
  payoutDate: '28 Jun',
  bankAccount: '**** 4821',
  sessionRate: 65,
  history: [
    { month: 'May 2026', amount: 2180, date: '28 May', clients: 4 },
    { month: 'Apr 2026', amount: 2050, date: '28 Apr', clients: 4 },
    { month: 'Mar 2026', amount: 1920, date: '28 Mar', clients: 3 },
  ],
  pendingPayouts: [
    {
      id: 'pp1',
      amount: 420,
      scheduledDate: '28 Jun 2026',
      label: 'June balance',
      status: 'scheduled',
    },
  ],
};

export const MOCK_PROFILE: CoachProfile = {
  photoUrl: '',
  tagline: 'Strength & conditioning coach',
  intro:
    'I help busy professionals build sustainable strength habits with evidence-based programming and clear accountability.',
  details: [
    { key: 'location', label: 'Location', value: 'London, UK (remote-friendly)' },
    { key: 'experience', label: 'Experience', value: '8 years coaching' },
    { key: 'languages', label: 'Languages', value: 'English, Spanish' },
  ],
  socials: [
    { key: 'instagram', label: 'Instagram', url: 'https://instagram.com/' },
    { key: 'website', label: 'Website', url: 'https://coachtek.app' },
  ],
  certifications: [
    { name: 'CSCS', issuer: 'NSCA', year: '2019' },
    { name: 'Precision Nutrition L1', issuer: 'PN', year: '2021' },
  ],
  stats: [
    { key: 'clients', label: 'Active clients', value: '4' },
    { key: 'sessions', label: 'Sessions this month', value: '38' },
    { key: 'rating', label: 'Avg rating', value: '4.9' },
  ],
  whatsappBusinessNumber: '+447700900123',
  email: 'alex@coachtek.app',
};

export function buildActivitySeries(range: string): ActivityPoint[] {
  const counts: Record<string, number> = { '7d': 7, '30d': 30, '90d': 12, '6mo': 6 };
  const n = counts[range] ?? 7;
  const labels =
    range === '6mo'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      : Array.from({ length: n }, (_, i) => `${i + 1}`);

  return labels.map((label, i) => ({
    label,
    steps: 6000 + Math.round(Math.sin(i * 0.8) * 1500 + i * 120),
    minutes: 25 + Math.round(Math.cos(i * 0.5) * 10 + i * 0.5),
    workouts: 2 + (i % 3),
  }));
}

export const MOCK_FAQ: FaqItem[] = [
  {
    q: 'How do payouts work?',
    a: 'Earnings accumulate through the month and pay out on the 28th to your linked bank account.',
  },
  {
    q: 'Can I archive a client?',
    a: 'Yes — open the client profile and use Archive client. History is retained for your records.',
  },
  {
    q: 'How do I respond to feedback?',
    a: 'Open Feedback from the sidebar. Replies are sent to the client inbox.',
  },
];

export const MOCK_PASSWORD = 'coach123';
