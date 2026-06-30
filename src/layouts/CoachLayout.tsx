import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PageSlideTransition } from '@/components/PageSlideTransition';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  coachPageTitle,
} from '@/config/coachConsoleConfig';
import type { CoachConsoleConfig } from '@/config/coachConsoleConfig';
import { SOLO_COACH_CONSOLE } from '@/config/coachConsoleConfig';
import { CoachConsoleProvider, useCoachConsole } from '@/context/CoachConsoleContext';
import { Avatar } from '@/components/ui';
import {
  IconBell,
  IconChevRight,
  IconLogout,
  IconMark,
  IconSwitch,
} from '@/components/icons';
import { roleFromPath } from '@/config/roles';
import { PageLoadingOverlay } from '@/components/PageLoadingOverlay';
import { RoleSwitchPopover, RoleSwitchSheet } from '@/components/RoleSwitch';
import { CoachMobileNav } from '@/layouts/CoachMobileNav';
import { CoachNavSections } from '@/layouts/CoachNavSections';
import { NotificationDropdown } from '@/features/coach/notifications/NotificationDropdown';
import { useNotifications } from '@/features/coach/notifications/useNotifications';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePwaPause } from '@/hooks/usePwaPause';
import { useAuth } from '@/context/AuthContext';
import { usePageLoadingController } from '@/context/PageLoadingContext';

function CoachLayoutInner() {
  const config = useCoachConsole();
  const { user, logout } = useAuth();
  const { active: pageLoading, setPageLoading } = usePageLoadingController();
  const navigate = useNavigate();
  const location = useLocation();
  const [switchOpen, setSwitchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [titleExtra, setTitleExtra] = useState<string | null>(null);
  const { items: notificationItems, hasUnread, prefetch, clear, triggerSample } = useNotifications();
  const isMobile = useIsMobile();

  useEffect(() => {
    prefetch();
  }, [prefetch]);

  useEffect(() => {
    if (!notificationsOpen || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [notificationsOpen, isMobile]);

  useEffect(() => {
    if (!switchOpen || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [switchOpen, isMobile]);

  const closeTransientUi = useCallback(() => {
    setNotificationsOpen(false);
    setSettingsOpen(false);
    setSwitchOpen(false);
  }, []);

  usePwaPause(closeTransientUi);

  useEffect(() => {
    setPageLoading(config.loadingKey, true);
    setTitleExtra(null);
    setNotificationsOpen(false);
    setSettingsOpen(false);
    setSwitchOpen(false);
    const stuckTimer = window.setTimeout(() => {
      setPageLoading(config.loadingKey, false);
    }, 4000);
    return () => window.clearTimeout(stuckTimer);
  }, [location.pathname, setPageLoading, config.loadingKey]);

  const [pageTitle, pageSubtitle] = useMemo(
    () => coachPageTitle(config, location.pathname),
    [config, location.pathname],
  );

  const isDashboard = location.pathname === `${config.basePath}/dashboard`;
  const isImmersive = config.immersivePathPatterns?.some((rx) => rx.test(location.pathname)) ?? false;

  const coachFirstName = user?.name?.split(/\s+/)[0] ?? 'Coach';

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    [],
  );

  const title = isDashboard ? `Welcome coach ${coachFirstName}` : pageTitle;
  const subtitle = isDashboard ? todayLabel : pageSubtitle;
  const showMobileWelcome = isMobile && isDashboard;

  const topbarBrandCompact = (
    <div className="ct-topbar-brand-compact" aria-label="CoachTek">
      <div className="ct-brand-mark ct-brand-mark-compact">
        <IconMark size={14} color="var(--ct-tab-volt-fg)" />
      </div>
      <span className="ct-topbar-brand-compact-name">CoachTek</span>
    </div>
  );

  const topbarNotifications = (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        className={`ct-press ct-icon-btn${notificationsOpen ? ' is-active' : ''}`}
        style={{ padding: 0 }}
        aria-expanded={notificationsOpen}
        aria-haspopup="menu"
        aria-label="Notifications"
        onClick={() => {
          setNotificationsOpen((v) => !v);
          setSettingsOpen(false);
        }}
      >
        <IconBell size={20} />
        {hasUnread ? <span className="ct-icon-btn-dot" /> : null}
      </button>
      {notificationsOpen && !isMobile ? (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 34 }}
            onClick={() => setNotificationsOpen(false)}
          />
          <NotificationDropdown
            variant="desktop"
            items={notificationItems}
            onClear={clear}
            onClose={() => setNotificationsOpen(false)}
            onTriggerSample={triggerSample}
          />
        </>
      ) : null}
    </div>
  );

  const topbarSettings = (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        className="ct-press ct-icon-btn"
        style={{ padding: 0, overflow: 'hidden' }}
        onClick={() => {
          setSettingsOpen((v) => !v);
          setSwitchOpen(false);
          setNotificationsOpen(false);
        }}
      >
        <Avatar initials={user?.initials ?? 'CT'} tint="sage" size={34} shape="round" />
      </button>
      {settingsOpen ? (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 34 }}
            onClick={() => setSettingsOpen(false)}
          />
          <div className="ct-settings-menu">
            <ThemeToggle />
            <div style={{ height: 1, background: 'var(--ct-divider)', margin: '6px 4px' }} />
            <div style={{ fontSize: 11.5, fontWeight: 700, padding: '6px 10px 2px' }}>
              Settings
            </div>
            {config.settingsItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSettingsOpen(false)}
                className="ct-press"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '9px 10px',
                  borderRadius: 'var(--ct-radius-sm)',
                  marginBottom: 2,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 'var(--ct-radius-sm)',
                    background: 'var(--ct-surface-soft)',
                    border: '1px solid var(--ct-border)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--ct-text-body)',
                  }}
                >
                  <item.icon size={18} />
                </div>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{item.label}</span>
                <IconChevRight size={16} color="var(--ct-text-muted)" />
              </Link>
            ))}
            <button
              type="button"
              className="ct-press"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: 'transparent',
                border: 'none',
                padding: '10px 6px 6px',
                marginTop: 4,
                borderTop: '1px solid var(--ct-divider)',
                color: 'var(--ct-text-muted)',
                fontWeight: 600,
                fontSize: 12.5,
              }}
              onClick={() => {
                setSettingsOpen(false);
                setSwitchOpen(true);
              }}
            >
              <IconSwitch size={16} />
              Switch view
            </button>
            <button
              type="button"
              className="ct-press ct-signout-btn"
              onClick={async () => {
                await logout();
                navigate(config.loginPath);
              }}
            >
              <IconLogout size={16} />
              Sign out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );

  if (isImmersive) {
    return (
      <div className="ct-shell ct-shell-immersive">
        <main className="ct-main ct-main-immersive ct-scroll">
          <PageSlideTransition>
            <Outlet context={{ setTitleExtra }} />
          </PageSlideTransition>
        </main>
      </div>
    );
  }

  return (
    <div className="ct-shell">
      <header className={`ct-topbar${showMobileWelcome ? ' ct-topbar-mobile-welcome' : ''}`}>
        <div className="ct-topbar-brand-col">
          <div className="ct-topbar-brand">
            <div className="ct-brand-mark">
              <IconMark size={18} color="var(--ct-tab-volt-fg)" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--ct-font-display)', fontSize: 18, fontWeight: 700 }}>
                CoachTek
              </div>
              <div style={{ fontSize: 11, color: 'var(--ct-text-muted)', marginTop: 2 }}>
                {config.brandSubtitle}
              </div>
            </div>
          </div>
        </div>

        <div className={`ct-topbar-main${showMobileWelcome ? ' ct-topbar-main-mobile-welcome' : ''}`}>
        {showMobileWelcome ? (
          <>
            <div className="ct-topbar-mobile-head">
              {topbarBrandCompact}
              <div className="ct-topbar-mobile-actions">
                {topbarNotifications}
                {topbarSettings}
              </div>
            </div>
            <div className="ct-topbar-mobile-greeting">
              <h1>{title}</h1>
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
          </>
        ) : (
          <>
        <div className="ct-topbar-title">
          {title || titleExtra ? (
            <div className="ct-topbar-title-row">
              {title ? (
                <h1>
                  {title}
                  {titleExtra ? <span className="ct-topbar-title-stat">{titleExtra}</span> : null}
                </h1>
              ) : (
                <span className="ct-topbar-title-stat">{titleExtra}</span>
              )}
            </div>
          ) : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </div>

        {topbarNotifications}

        <ThemeToggle variant="toolbar" />

        {topbarSettings}
          </>
        )}
        </div>
      </header>

      <div className="ct-body">
        <aside className="ct-sidebar">
          <div className="ct-sidebar-scroll ct-scroll">
            <CoachNavSections />
          </div>

          <div className="ct-sidebar-footer">
            {switchOpen && !isMobile ? (
              <div className="ct-popover ct-scroll">
                <RoleSwitchPopover current={roleFromPath(location.pathname)} onClose={() => setSwitchOpen(false)} />
              </div>
            ) : null}
            <Link to={`${config.basePath}/profile`} className="ct-press ct-profile-card">
              <Avatar initials={user?.initials ?? 'CT'} tint="sage" size={34} />
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div className="ct-profile-card-label">My profile</div>
                <div className="ct-profile-card-name">{user?.name}</div>
              </div>
              <IconChevRight size={16} color="var(--ct-text-muted)" />
            </Link>
            <div className="ct-sidebar-footer-actions">
              <button
                type="button"
                className="ct-press ct-switch-btn"
                onClick={() => setSwitchOpen((v) => !v)}
              >
                <IconSwitch size={14} />
                Switch view
              </button>
              <button
                type="button"
                className="ct-press ct-signout-btn"
                onClick={async () => {
                  await logout();
                  navigate(config.loginPath);
                }}
              >
                <IconLogout size={15} />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main
          className={`ct-main ct-scroll${config.mainSurfacePaths?.includes(location.pathname) ? ' ct-main-surface' : ''}`}
        >
          <PageLoadingOverlay active={pageLoading} />
          <Outlet context={{ setTitleExtra }} />
        </main>
      </div>
      {notificationsOpen && isMobile ? (
        <NotificationDropdown
          variant="mobile"
          items={notificationItems}
          onClear={clear}
          onClose={() => setNotificationsOpen(false)}
          onTriggerSample={triggerSample}
        />
      ) : null}
      {switchOpen && isMobile ? (
        <RoleSwitchSheet
          current={roleFromPath(location.pathname)}
          onClose={() => setSwitchOpen(false)}
        />
      ) : null}
      <CoachMobileNav />
    </div>
  );
}

export function CoachLayout({ config = SOLO_COACH_CONSOLE }: { config?: CoachConsoleConfig }) {
  return (
    <CoachConsoleProvider config={config}>
      <CoachLayoutInner />
    </CoachConsoleProvider>
  );
}
