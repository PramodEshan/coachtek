import { useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IconChevLeft, IconMore } from '@/components/icons';
import {
  coachMobileNavItems,
  coachMobilePrimaryItems,
  isCoachMobileMoreRoute,
} from '@/config/coachConsoleConfig';
import { useCoachConsole } from '@/context/CoachConsoleContext';
import { usePwaPause } from '@/hooks/usePwaPause';
import { CoachNavSections } from '@/layouts/CoachNavSections';

export function CoachMobileNav() {
  const config = useCoachConsole();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryItems = coachMobilePrimaryItems(config);
  const allItems = coachMobileNavItems(config);
  const moreActive = isCoachMobileMoreRoute(config, location.pathname);
  const moreBadge = allItems
    .filter((item) => !config.mobilePrimaryPaths.includes(item.to))
    .reduce((total, item) => total + (item.badge ?? 0), 0);

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  const closeMore = useCallback(() => setMoreOpen(false), []);
  usePwaPause(closeMore);

  useEffect(() => {
    if (!moreOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [moreOpen]);

  return (
    <>
      {moreOpen ? (
        <div className="ct-mobile-nav-sheet-backdrop" onClick={() => setMoreOpen(false)}>
          <div
            className="ct-mobile-nav-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ct-mobile-nav-sheet-head">
              <div className="ct-mobile-nav-sheet-title">Menu</div>
            </div>
            <div className="ct-mobile-nav-sheet-scroll ct-scroll">
              <CoachNavSections onNavigate={() => setMoreOpen(false)} />
            </div>
            <div className="ct-notifications-sheet-footer">
              <button
                type="button"
                className="ct-press ct-notifications-back"
                onClick={() => setMoreOpen(false)}
              >
                <IconChevLeft size={18} />
                Back
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="ct-mobile-nav" aria-label="Main navigation">
        <div className="ct-mobile-nav-primary">
          {primaryItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `ct-press ct-mobile-nav-item${isActive ? ' active' : ''}`}
            >
              <span className="ct-mobile-nav-icon">
                <item.icon size={22} />
                {item.badge ? <span className="ct-mobile-nav-badge">{item.badge}</span> : null}
              </span>
              <span className="ct-mobile-nav-label">{item.shortLabel ?? item.label}</span>
            </NavLink>
          ))}
          <button
            type="button"
            className={`ct-press ct-mobile-nav-item ct-mobile-nav-more${moreActive ? ' active' : ''}`}
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
            onClick={() => setMoreOpen(true)}
          >
            <span className="ct-mobile-nav-icon">
              <IconMore size={22} />
              {moreBadge > 0 ? <span className="ct-mobile-nav-badge">{moreBadge}</span> : null}
            </span>
            <span className="ct-mobile-nav-label">More</span>
          </button>
        </div>

        <div className="ct-mobile-nav-rail ct-scroll" aria-label="Full navigation">
          {allItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) => `ct-press ct-mobile-nav-item${isActive ? ' active' : ''}`}
            >
              <span className="ct-mobile-nav-icon">
                <item.icon size={20} />
                {item.badge ? <span className="ct-mobile-nav-badge">{item.badge}</span> : null}
              </span>
              <span className="ct-mobile-nav-label">{item.shortLabel ?? item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
