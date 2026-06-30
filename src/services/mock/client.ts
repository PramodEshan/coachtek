import { delay, getStore } from '@/services/mock/store';
import { readSession } from '@/services/mock/auth';
import type {
  BodyMetricEntry,
  ClientPaymentRecord,
  ClientProfile,
  ClientProgressSummary,
  ClientWorkout,
  CompleteWorkoutInput,
  SessionCompletionLog,
} from '@/services/types';

const SESSIONS_SCHEDULED = 16;

function currentClientId(): string {
  return readSession()?.user?.id ?? getStore().clientProfile.userId;
}

function logsForClient(): SessionCompletionLog[] {
  const clientId = currentClientId();
  return getStore().sessionLogs.filter((log) => log.clientId === clientId);
}

function buildWeeklyParticipation(logs: SessionCompletionLog[]) {
  const weeks: { label: string; completed: number; scheduled: number }[] = [
    { label: 'Jun 2', completed: 0, scheduled: 4 },
    { label: 'Jun 9', completed: 0, scheduled: 4 },
    { label: 'Jun 16', completed: 0, scheduled: 4 },
    { label: 'Jun 23', completed: 0, scheduled: 4 },
  ];

  for (const log of logs) {
    const day = Number(log.date.slice(8));
    if (day >= 2 && day <= 8) weeks[0].completed += 1;
    else if (day >= 9 && day <= 15) weeks[1].completed += 1;
    else if (day >= 16 && day <= 22) weeks[2].completed += 1;
    else if (day >= 23) weeks[3].completed += 1;
  }

  return weeks;
}

function buildProgressSummary(): ClientProgressSummary {
  const store = getStore();
  const profile = store.clientProfile;
  const logs = logsForClient();
  const metrics = store.bodyMetrics;
  const sessionsCompleted = logs.length;
  const participationRate = Math.round((sessionsCompleted / SESSIONS_SCHEDULED) * 100);
  const totalCaloriesBurned = logs.reduce((sum, log) => sum + log.caloriesBurned, 0);
  const avgSessionMinutes = sessionsCompleted
    ? Math.round(logs.reduce((sum, log) => sum + log.durationMinutes, 0) / sessionsCompleted)
    : 0;
  const latestWeightKg = logs.at(-1)?.weightKg ?? metrics.at(-1)?.weight ?? profile.weight ?? 0;
  const startWeight = metrics[0]?.weight ?? latestWeightKg;
  const weightChangeKg = Math.round((latestWeightKg - startWeight) * 10) / 10;

  return {
    participationRate,
    sessionsCompleted,
    sessionsScheduled: SESSIONS_SCHEDULED,
    currentStreak: profile.streak,
    totalCaloriesBurned,
    avgSessionMinutes,
    weightChangeKg,
    latestWeightKg,
    recentSessions: [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    weeklyParticipation: buildWeeklyParticipation(logs),
  };
}

export const clientService = {
  async profile(): Promise<ClientProfile> {
    await delay();
    return getStore().clientProfile;
  },

  async todayWorkout(): Promise<ClientWorkout> {
    await delay();
    return getStore().clientWorkout;
  },

  async bodyMetrics(): Promise<BodyMetricEntry[]> {
    await delay();
    return getStore().bodyMetrics;
  },

  async sessionLogs(): Promise<SessionCompletionLog[]> {
    await delay();
    return [...logsForClient()].sort((a, b) => b.date.localeCompare(a.date));
  },

  async progressSummary(): Promise<ClientProgressSummary> {
    await delay();
    return buildProgressSummary();
  },

  async completeWorkout(input: CompleteWorkoutInput): Promise<void> {
    await delay();
    const store = getStore();
    const workout = store.clientWorkout;
    const profile = store.clientProfile;
    const clientId = currentClientId();

    const log: SessionCompletionLog = {
      id: `sl-${Date.now()}`,
      clientId,
      workoutId: workout.id,
      date: workout.date,
      title: workout.title,
      durationMinutes: input.durationMinutes,
      caloriesBurned: input.caloriesBurned,
      weightKg: input.weightKg,
      feeling: input.feeling,
      comment: input.comment?.trim() || undefined,
      exerciseLogs: input.exerciseLogs,
    };

    store.sessionLogs.push(log);
    workout.completed = true;
    profile.todayWorkoutStatus = 'complete';
    profile.lastCheckIn = workout.date;
    profile.weight = input.weightKg;

    const existingMetric = store.bodyMetrics.find((m) => m.date === workout.date);
    if (existingMetric) {
      existingMetric.weight = input.weightKg;
    } else {
      const last = store.bodyMetrics.at(-1);
      store.bodyMetrics.push({
        date: workout.date,
        weight: input.weightKg,
        chest: last?.chest,
        waist: last?.waist,
      });
    }

    if (input.comment?.trim()) {
      workout.coachNote = `${workout.coachNote ?? ''}\nClient: ${input.comment.trim()}`.trim();
    }
  },

  async updateProfile(patch: Partial<ClientProfile>): Promise<ClientProfile> {
    await delay();
    Object.assign(getStore().clientProfile, patch);
    return getStore().clientProfile;
  },

  async pauseSubscription(): Promise<void> {
    await delay();
    getStore().clientProfile.subscriptionStatus = 'paused';
  },

  async exportData(): Promise<string> {
    await delay();
    const profile = getStore().clientProfile;
    const logs = logsForClient();
    const header = 'date,workout,duration_min,calories,weight_kg,feeling,status';
    const rows = logs.map(
      (log) =>
        `${log.date},${log.title},${log.durationMinutes},${log.caloriesBurned},${log.weightKg},${log.feeling},complete`,
    );
    const today = getStore().clientWorkout;
    if (profile.todayWorkoutStatus === 'pending') {
      rows.push(`${today.date},${today.title},,,, ,pending`);
    }
    return [header, ...rows].join('\n');
  },

  async paymentHistory(): Promise<ClientPaymentRecord[]> {
    await delay();
    const clientId = currentClientId();
    return getStore().clientPayments.filter((p) => p.clientId === clientId);
  },

  async sessionById(sessionId: string): Promise<SessionCompletionLog | null> {
    await delay();
    return getStore().sessionLogs.find((s) => s.id === sessionId) ?? null;
  },

  async saveBodyMetric(entry: BodyMetricEntry): Promise<BodyMetricEntry[]> {
    await delay();
    const store = getStore();
    const existing = store.bodyMetrics.findIndex((m) => m.date === entry.date);
    if (existing >= 0) {
      store.bodyMetrics[existing] = { ...store.bodyMetrics[existing], ...entry };
    } else {
      store.bodyMetrics.push(entry);
    }
    return store.bodyMetrics;
  },

  async progressPhotos() {
    await delay();
    const clientId = currentClientId();
    return getStore().progressPhotos.filter((p) => p.clientId === clientId);
  },

  async uploadProgressPhoto(dataUrl: string, note?: string) {
    await delay();
    const photo = {
      id: `pp-${Date.now()}`,
      clientId: currentClientId(),
      date: new Date().toISOString().slice(0, 10),
      dataUrl,
      note,
    };
    getStore().progressPhotos.unshift(photo);
    return photo;
  },

  async submitFeedback(input: {
    category: 'coach' | 'platform' | 'billing';
    description: string;
  }): Promise<void> {
    await delay();
    const store = getStore();
    const profile = store.clientProfile;
    const isPlatform = input.category === 'platform' || input.category === 'billing';

    if (isPlatform) {
      store.operatorComplaints.unshift({
        id: `oc-${Date.now()}`,
        submitterName: profile.coachName,
        submitterRole: 'client',
        type: input.category === 'billing' ? 'billing' : 'platform',
        subject: `Client feedback: ${input.category}`,
        body: input.description,
        date: new Date().toISOString().slice(0, 10),
        status: 'new',
        internalNotes: [],
        scope: 'platform',
      });
    } else {
      store.feedback.unshift({
        id: `f-${Date.now()}`,
        clientId: profile.userId,
        clientName: 'Jordan Lee',
        subject: 'Client feedback',
        body: input.description,
        date: new Date().toISOString().slice(0, 10),
        status: 'open',
        replies: [],
      });
    }
  },
};
