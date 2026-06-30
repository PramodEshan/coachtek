import { Link } from 'react-router-dom';
import type { ClientProgressSummary } from '@/services/types';
import { sessionFeelingEmoji, sessionFeelingLabel } from '@/utils/clientUi';

interface ClientProgressWidgetProps {
  summary: ClientProgressSummary;
  compact?: boolean;
}

function ParticipationRing({ rate }: { rate: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(rate, 100) / 100);

  return (
    <div className="ct-client-progress-ring">
      <svg viewBox="0 0 80 80" aria-hidden>
        <circle cx="40" cy="40" r={radius} fill="none" strokeWidth="6" className="ct-client-progress-ring-track" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="ct-client-progress-ring-fill"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ct-client-progress-ring-label">
        <div className="ct-client-progress-ring-value">{rate}%</div>
        <div className="ct-client-progress-ring-caption">Done</div>
      </div>
    </div>
  );
}

export function ClientProgressWidget({ summary, compact = false }: ClientProgressWidgetProps) {
  const weightDelta = summary.weightChangeKg;
  const weightTrend =
    weightDelta === 0 ? 'Stable' : weightDelta < 0 ? `${Math.abs(weightDelta)} kg down` : `${weightDelta} kg up`;

  return (
    <section className={`ct-client-progress-widget${compact ? ' is-compact' : ''}`}>
      <div className="ct-client-progress-widget-main">
        <div className="ct-client-progress-widget-header">
          <div>
            <div className="ct-client-progress-widget-kicker">Your progress</div>
            <div className="ct-client-progress-widget-title">
              {summary.sessionsCompleted} of {summary.sessionsScheduled} sessions
            </div>
          </div>
          <ParticipationRing rate={summary.participationRate} />
        </div>

        <div className="ct-client-progress-widget-stats">
          <div className="ct-client-progress-stat">
            <span className="ct-client-progress-stat-value">{summary.currentStreak}</span>
            <span className="ct-client-progress-stat-label">Day streak</span>
          </div>
          <div className="ct-client-progress-stat">
            <span className="ct-client-progress-stat-value">{summary.totalCaloriesBurned.toLocaleString()}</span>
            <span className="ct-client-progress-stat-label">Calories burned</span>
          </div>
          <div className="ct-client-progress-stat">
            <span className="ct-client-progress-stat-value">{summary.latestWeightKg} kg</span>
            <span className="ct-client-progress-stat-label">{weightTrend}</span>
          </div>
          <div className="ct-client-progress-stat">
            <span className="ct-client-progress-stat-value">{summary.avgSessionMinutes} min</span>
            <span className="ct-client-progress-stat-label">Avg session</span>
          </div>
        </div>
      </div>

      {!compact ? (
        <div className="ct-client-progress-widget-side">
          <div className="ct-client-progress-widget-side-title">Weekly participation</div>
          <div className="ct-client-progress-week-chart">
            {summary.weeklyParticipation.map((week) => {
              const pct = week.scheduled ? Math.round((week.completed / week.scheduled) * 100) : 0;
              return (
                <div key={week.label} className="ct-client-progress-week-col">
                  <div className="ct-client-progress-week-bar-area">
                    <div className="ct-client-progress-week-bar" style={{ height: `${Math.max(pct, 8)}%` }} />
                  </div>
                  <div className="ct-client-progress-week-meta">
                    <span>{week.completed}/{week.scheduled}</span>
                    <span>{week.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {summary.recentSessions.length > 0 ? (
            <div className="ct-client-progress-recent">
              <div className="ct-client-progress-widget-side-title">Recent sessions</div>
              {summary.recentSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="ct-client-progress-recent-row">
                  <div>
                    <div className="ct-client-progress-recent-title">{session.title}</div>
                    <div className="ct-client-progress-recent-meta">
                      {session.date} · {session.durationMinutes} min · {session.caloriesBurned} kcal · {session.weightKg} kg
                    </div>
                  </div>
                  <span className="ct-client-progress-feeling" title={sessionFeelingLabel(session.feeling)}>
                    {sessionFeelingEmoji(session.feeling)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          <Link to="/client/progress" className="ct-client-progress-widget-link ct-press">
            View full progress
          </Link>
        </div>
      ) : null}
    </section>
  );
}
