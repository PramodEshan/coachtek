import { MOCK_FAQ } from '@/data/seed';
import { Panel } from '@/components/ui';
import { useCoachConsoleLoading } from '@/context/CoachConsoleContext';

export function CoachHelpPage() {
  useCoachConsoleLoading();

  return (
    <div className="ct-page" style={{ maxWidth: 860 }}>
      {MOCK_FAQ.map((item) => (
        <Panel key={item.q} style={{ marginBottom: 10 }}>
          <div className="ct-panel-body">
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{item.q}</div>
            <div style={{ fontSize: 13.5, color: 'var(--ct-text-body)', marginTop: 8, lineHeight: 1.45 }}>
              {item.a}
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}
