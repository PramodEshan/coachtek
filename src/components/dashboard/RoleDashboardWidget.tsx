import { Link } from 'react-router-dom';
import type { DashboardTrendPoint } from '@/services/types';

export interface RoleDashboardStat {
  value: string;
  label: string;
}

export interface RoleDashboardSideRow {
  title: string;
  meta: string;
  badge?: string;
}

interface RoleDashboardWidgetProps {
  kicker: string;
  title: string;
  ringValue?: number | string;
  ringCaption?: string;
  stats: RoleDashboardStat[];
  chartTitle?: string;
  chartPoints?: DashboardTrendPoint[];
  sideRows?: RoleDashboardSideRow[];
  linkTo?: string;
  linkLabel?: string;
  compact?: boolean;
}

function ProgressRing({ value, caption }: { value: number | string; caption: string }) {
  const numeric = typeof value === 'number' ? value : Number.parseFloat(String(value));
  const rate = Number.isFinite(numeric) ? Math.min(Math.max(numeric, 0), 100) : 0;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - rate / 100);
  const showRing = typeof value === 'number' && rate <= 100;

  return (
    <div className="ct-client-progress-ring">
      <svg viewBox="0 0 80 80" aria-hidden>
        <circle cx="40" cy="40" r={radius} fill="none" strokeWidth="6" className="ct-client-progress-ring-track" />
        {showRing ? (
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
        ) : null}
      </svg>
      <div className="ct-client-progress-ring-label">
        <div className="ct-client-progress-ring-value">
          {value}
          {showRing ? '%' : ''}
        </div>
        <div className="ct-client-progress-ring-caption">{caption}</div>
      </div>
    </div>
  );
}

export function RoleDashboardWidget({
  kicker,
  title,
  ringValue,
  ringCaption = 'Today',
  stats,
  chartTitle,
  chartPoints,
  sideRows,
  linkTo,
  linkLabel,
  compact = false,
}: RoleDashboardWidgetProps) {
  const chartMax = chartPoints?.length ? Math.max(...chartPoints.map((p) => p.value), 1) : 1;

  return (
    <section className={`ct-client-progress-widget${compact ? ' is-compact' : ''}`}>
      <div className="ct-client-progress-widget-main">
        <div className="ct-client-progress-widget-header">
          <div>
            <div className="ct-client-progress-widget-kicker">{kicker}</div>
            <div className="ct-client-progress-widget-title">{title}</div>
          </div>
          {ringValue !== undefined ? <ProgressRing value={ringValue} caption={ringCaption} /> : null}
        </div>

        <div className={`ct-client-progress-widget-stats ct-role-dashboard-stats-${Math.min(stats.length, 4)}`}>
          {stats.map((stat) => (
            <div key={stat.label} className="ct-client-progress-stat">
              <span className="ct-client-progress-stat-value">{stat.value}</span>
              <span className="ct-client-progress-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {!compact && (chartPoints?.length || sideRows?.length) ? (
        <div className="ct-client-progress-widget-side">
          {chartPoints?.length ? (
            <>
              <div className="ct-client-progress-widget-side-title">{chartTitle ?? 'Trend'}</div>
              <div className="ct-client-progress-week-chart">
                {chartPoints.map((point) => {
                  const pct = Math.round((point.value / chartMax) * 100);
                  return (
                    <div key={point.label} className="ct-client-progress-week-col">
                      <div className="ct-client-progress-week-bar-area">
                        <div className="ct-client-progress-week-bar" style={{ height: `${Math.max(pct, 8)}%` }} />
                      </div>
                      <div className="ct-client-progress-week-meta">
                        <span>{point.value}</span>
                        <span>{point.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}

          {sideRows?.length ? (
            <div className="ct-client-progress-recent">
              {sideRows.map((row) => (
                <div key={row.title} className="ct-client-progress-recent-row">
                  <div>
                    <div className="ct-client-progress-recent-title">{row.title}</div>
                    <div className="ct-client-progress-recent-meta">{row.meta}</div>
                  </div>
                  {row.badge ? <span className="ct-pill ct-pill-pending">{row.badge}</span> : null}
                </div>
              ))}
            </div>
          ) : null}

          {linkTo && linkLabel ? (
            <Link to={linkTo} className="ct-client-progress-widget-link ct-press">
              {linkLabel}
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
