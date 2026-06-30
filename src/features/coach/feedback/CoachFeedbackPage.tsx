import { useEffect, useState } from 'react';
import { Panel } from '@/components/ui';
import { useCoachConsoleLoading } from '@/context/CoachConsoleContext';
import { feedbackService } from '@/services/api';
import { feedbackPillClass } from '@/utils/coachUi';
import type { FeedbackItem } from '@/services/types';

export function CoachFeedbackPage() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useCoachConsoleLoading(loading);

  useEffect(() => {
    feedbackService.list().then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <div className="ct-page" style={{ maxWidth: 860, gap: 16 }}>
      {items.map((item) => (
        <Panel key={item.id}>
          <div className="ct-panel-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{item.subject}</div>
                <div style={{ color: 'var(--ct-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
                  {item.clientName} · {item.date}
                </div>
              </div>
              <span className={feedbackPillClass(item.status)}>{item.status}</span>
            </div>
            <p style={{ color: 'var(--ct-text-body)', lineHeight: 1.55, marginTop: 12 }}>{item.body}</p>
            {item.replies.map((reply, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--ct-surface-soft)',
                  padding: 12,
                  borderRadius: 'var(--ct-radius-sm)',
                  marginTop: 10,
                }}
              >
                <div style={{ fontSize: 11.5, color: 'var(--ct-text-muted)' }}>Coach · {reply.at}</div>
                <div style={{ marginTop: 4 }}>{reply.text}</div>
              </div>
            ))}
            {item.status !== 'resolved' ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                <input
                  style={{ flex: 1, minWidth: 200, border: '1px solid var(--ct-border)', borderRadius: 'var(--ct-radius-sm)', padding: '11px 13px', background: 'var(--ct-surface-soft)' }}
                  placeholder="Describe your response…"
                  value={replyDrafts[item.id] ?? ''}
                  onChange={(e) => setReplyDrafts((d) => ({ ...d, [item.id]: e.target.value }))}
                />
                <button
                  type="button"
                  className="ct-btn-primary ct-press"
                  onClick={async () => {
                    const text = replyDrafts[item.id]?.trim();
                    if (!text) return;
                    const updated = await feedbackService.reply(item.id, text);
                    setItems((rows) => rows.map((r) => (r.id === updated.id ? updated : r)));
                    setReplyDrafts((d) => ({ ...d, [item.id]: '' }));
                  }}
                >
                  Reply
                </button>
                <button
                  type="button"
                  className="ct-btn-secondary ct-press"
                  onClick={async () => {
                    const updated = await feedbackService.resolve(item.id);
                    setItems((rows) => rows.map((r) => (r.id === updated.id ? updated : r)));
                  }}
                >
                  Mark resolved
                </button>
              </div>
            ) : null}
          </div>
        </Panel>
      ))}
    </div>
  );
}
