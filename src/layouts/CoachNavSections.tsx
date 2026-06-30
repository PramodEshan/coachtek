import { NavLink } from 'react-router-dom';
import { useCoachConsole } from '@/context/CoachConsoleContext';

type CoachNavSectionsProps = {
  onNavigate?: () => void;
  className?: string;
};

export function CoachNavSections({ onNavigate, className }: CoachNavSectionsProps) {
  const { navSections } = useCoachConsole();

  return (
    <div className={className}>
      {navSections.map((section) => (
        <div key={section.title} className="ct-nav-section">
          <div className="ct-nav-section-title">{section.title}</div>
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `ct-press ct-coach-panel-btn ct-nav-btn${isActive ? ' active' : ''}`
              }
            >
              <span className="ct-nav-icon">
                <item.icon size={18} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="ct-nav-btn-label">{item.label}</span>
                {item.detail ? <span className="ct-nav-btn-detail">{item.detail}</span> : null}
              </span>
              {item.badge ? <span className="ct-nav-badge">{item.badge}</span> : null}
            </NavLink>
          ))}
        </div>
      ))}
    </div>
  );
}
