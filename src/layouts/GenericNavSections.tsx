import { NavLink } from 'react-router-dom';
import type { NavSection } from '@/config/navTypes';

type GenericNavSectionsProps = {
  sections: NavSection[];
  onNavigate?: () => void;
  className?: string;
};

export function GenericNavSections({ sections, onNavigate, className }: GenericNavSectionsProps) {
  return (
    <div className={className}>
      {sections.map((section) => (
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
