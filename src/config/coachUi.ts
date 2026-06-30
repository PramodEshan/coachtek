import { SOLO_COACH_CONSOLE, coachPageTitle as pageTitle } from '@/config/coachConsoleConfig';

export { SOLO_COACH_CONSOLE, type CoachNavItem, type CoachNavSection } from '@/config/coachConsoleConfig';

export const COACH_NAV_SECTIONS = SOLO_COACH_CONSOLE.navSections;
export const COACH_MOBILE_PRIMARY_PATHS = SOLO_COACH_CONSOLE.mobilePrimaryPaths;
export const COACH_SETTINGS_ITEMS = SOLO_COACH_CONSOLE.settingsItems;
export const COACH_PAGE_TITLES = SOLO_COACH_CONSOLE.pageTitles;

/** @deprecated Prefer `coachMobilePrimaryItems(config)` from coachConsoleConfig. */
export function coachMobilePrimaryItems() {
  return SOLO_COACH_CONSOLE.mobilePrimaryPaths.map((navPath) => {
    const items = SOLO_COACH_CONSOLE.navSections.flatMap((section) => section.items);
    const item = items.find((entry) => entry.to === navPath);
    if (!item) throw new Error(`Missing mobile nav item: ${navPath}`);
    return item;
  });
}

/** @deprecated Prefer `coachMobileNavItems(config)` from coachConsoleConfig. */
export function coachMobileNavItems() {
  return SOLO_COACH_CONSOLE.navSections.flatMap((section) => section.items);
}

/** @deprecated Prefer `isCoachMobileMoreRoute(config, pathname)` from coachConsoleConfig. */
export function isCoachMobileMoreRoute(pathname: string): boolean {
  if (!pathname.startsWith('/solo-coach/')) return false;
  return !SOLO_COACH_CONSOLE.mobilePrimaryPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/** @deprecated Prefer `coachPageTitle(config, pathname, clientName)` from coachConsoleConfig. */
export function coachPageTitle(pathname: string, clientName?: string): [string, string] {
  return pageTitle(SOLO_COACH_CONSOLE, pathname, clientName);
}
