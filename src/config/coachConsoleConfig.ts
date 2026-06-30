import type { ComponentType } from 'react';
import {
  IconAlert,
  IconCalendar,
  IconClients,
  IconClock,
  IconDashboard,
  IconHeart,
  IconLayers,
  IconLink,
  IconMessage,
  IconUser,
  IconWallet,
} from '@/components/icons';
import { MOCK_EARNINGS } from '@/data/seed';

const CURRENT_MONTH_YEAR = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

export interface CoachNavItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  detail?: string;
  badge?: number;
  shortLabel?: string;
}

export interface CoachNavSection {
  title: string;
  items: CoachNavItem[];
}

export interface CoachConsoleConfig {
  variant: 'solo' | 'gym';
  basePath: string;
  loadingKey: string;
  loginPath: string;
  brandSubtitle: string;
  navSections: CoachNavSection[];
  mobilePrimaryPaths: readonly string[];
  settingsItems: { to: string; label: string; icon: ComponentType<{ size?: number; color?: string }> }[];
  pageTitles: Record<string, [string, string]>;
  mainSurfacePaths?: string[];
  immersivePathPatterns?: RegExp[];
  features: {
    calendar: boolean;
    payouts: boolean;
    payroll: boolean;
    /** Solo coaches manage their own program library; gym coaches only see gym-assigned packages. */
    programLibrary: boolean;
  };
}

function path(base: string, segment: string) {
  return `${base}/${segment}`;
}

export const SOLO_COACH_CONSOLE: CoachConsoleConfig = {
  variant: 'solo',
  basePath: '/solo-coach',
  loadingKey: 'coach-main',
  loginPath: '/login',
  brandSubtitle: 'Solo coach',
  immersivePathPatterns: [/\/programs\/(new|[^/]+\/edit)$/],
  features: { calendar: true, payouts: true, payroll: false, programLibrary: true },
  navSections: [
    {
      title: 'Overview',
      items: [{ to: '/solo-coach/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: IconDashboard }],
    },
    {
      title: 'Sessions',
      items: [
        { to: '/solo-coach/today', label: "Today's sessions", shortLabel: 'Today', icon: IconClock, detail: '4 scheduled' },
        { to: '/solo-coach/calendar', label: 'Calendar', shortLabel: 'Calendar', icon: IconCalendar, detail: CURRENT_MONTH_YEAR },
        { to: '/solo-coach/programs', label: 'Program library', shortLabel: 'Programs', icon: IconLayers, detail: '3 templates' },
      ],
    },
    {
      title: 'Clients',
      items: [
        { to: '/solo-coach/clients', label: 'Clients', shortLabel: 'Clients', icon: IconClients },
        { to: '/solo-coach/messages', label: 'WhatsApp', shortLabel: 'Contact', icon: IconMessage, detail: 'Client contact' },
        { to: '/solo-coach/payouts', label: 'Payouts & earnings', shortLabel: 'Payouts', icon: IconWallet, detail: '£420 pending' },
        { to: '/solo-coach/feedback', label: 'Feedback', shortLabel: 'Feedback', icon: IconAlert },
      ],
    },
    {
      title: 'Tools',
      items: [
        { to: '/solo-coach/invites', label: 'Invite links', shortLabel: 'Invites', icon: IconLink, detail: '2 active' },
      ],
    },
  ],
  mobilePrimaryPaths: [
    '/solo-coach/dashboard',
    '/solo-coach/today',
    '/solo-coach/calendar',
    '/solo-coach/clients',
  ],
  settingsItems: [
    { to: '/solo-coach/profile', label: 'Edit profile', icon: IconUser },
    { to: '/solo-coach/help', label: 'Help desk', icon: IconHeart },
  ],
  pageTitles: {
    '/solo-coach/dashboard': ['Dashboard', ''],
    '/solo-coach/today': ["Today's sessions", new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })],
    '/solo-coach/calendar': [`Session Calendar — ${CURRENT_MONTH_YEAR}`, 'Sessions scheduled · past, today, and upcoming'],
    '/solo-coach/clients': ['Clients', 'Your active roster'],
    '/solo-coach/messages': ['WhatsApp', 'Contact clients on WhatsApp'],
    '/solo-coach/payouts': ['Payouts & earnings', CURRENT_MONTH_YEAR],
    '/solo-coach/programs': ['Program library', '3 templates'],
    '/solo-coach/invites': ['Invite links', 'Share links to get clients'],
    '/solo-coach/profile': ['My profile', 'Shared with clients on invite links'],
    '/solo-coach/help': ['Help desk', 'FAQ & contact'],
    '/solo-coach/feedback': ['Feedback', 'Client complaints & replies'],
  },
  mainSurfacePaths: [],
};

export const GYM_COACH_CONSOLE: CoachConsoleConfig = {
  variant: 'gym',
  basePath: '/gym/coach',
  loadingKey: 'gym-coach-main',
  loginPath: '/login',
  brandSubtitle: 'Gym coach',
  features: { calendar: false, payouts: false, payroll: true, programLibrary: false },
  navSections: [
    {
      title: 'Overview',
      items: [{ to: '/gym/coach/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: IconDashboard }],
    },
    {
      title: 'Sessions',
      items: [
        { to: '/gym/coach/today', label: "Today's sessions", shortLabel: 'Today', icon: IconClock, detail: '4 scheduled' },
        { to: '/gym/coach/programs', label: 'Assigned programs', shortLabel: 'Programs', icon: IconLayers, detail: '2 packages' },
      ],
    },
    {
      title: 'Clients',
      items: [
        { to: '/gym/coach/clients', label: 'Clients', shortLabel: 'Clients', icon: IconClients },
        { to: '/gym/coach/messages', label: 'WhatsApp', shortLabel: 'Contact', icon: IconMessage, detail: 'Client contact' },
        { to: '/gym/coach/payroll', label: 'Monthly payment', shortLabel: 'Payment', icon: IconWallet, detail: 'Gym payroll' },
        { to: '/gym/coach/feedback', label: 'Feedback', shortLabel: 'Feedback', icon: IconAlert },
      ],
    },
    {
      title: 'Tools',
      items: [
        { to: '/gym/coach/invites', label: 'Invite links', shortLabel: 'Invites', icon: IconLink, detail: '2 active' },
      ],
    },
  ],
  mobilePrimaryPaths: [
    '/gym/coach/dashboard',
    '/gym/coach/today',
    '/gym/coach/clients',
    '/gym/coach/messages',
  ],
  settingsItems: [
    { to: '/gym/coach/profile', label: 'Edit profile', icon: IconUser },
    { to: '/gym/coach/help', label: 'Help desk', icon: IconHeart },
  ],
  pageTitles: {
    '/gym/coach/dashboard': ['Dashboard', ''],
    '/gym/coach/today': ["Today's sessions", new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })],
    '/gym/coach/clients': ['Clients', 'Your assigned gym clients'],
    '/gym/coach/messages': ['WhatsApp', 'Contact clients on WhatsApp'],
    '/gym/coach/payroll': ['Monthly payment', 'Gym payroll summary'],
    '/gym/coach/programs': ['Assigned programs', 'Gym packages assigned to you'],
    '/gym/coach/invites': ['Invite links', 'Share links to get clients'],
    '/gym/coach/profile': ['My profile', 'Shared with clients on invite links'],
    '/gym/coach/help': ['Help desk', 'FAQ & contact'],
    '/gym/coach/feedback': ['Feedback', 'Client complaints & replies'],
  },
  mainSurfacePaths: [],
};

export function coachConsolePath(config: CoachConsoleConfig, segment: string) {
  return path(config.basePath, segment);
}

export function coachMobileNavItems(config: CoachConsoleConfig): CoachNavItem[] {
  return config.navSections.flatMap((section) => section.items);
}

export function coachMobilePrimaryItems(config: CoachConsoleConfig): CoachNavItem[] {
  const items = coachMobileNavItems(config);
  return config.mobilePrimaryPaths.map((navPath) => {
    const item = items.find((entry) => entry.to === navPath);
    if (!item) throw new Error(`Missing mobile nav item: ${navPath}`);
    return item;
  });
}

export function isCoachMobileMoreRoute(config: CoachConsoleConfig, pathname: string): boolean {
  if (!pathname.startsWith(`${config.basePath}/`)) return false;
  return !config.mobilePrimaryPaths.some(
    (navPath) => pathname === navPath || pathname.startsWith(`${navPath}/`),
  );
}

export function coachPageTitle(
  config: CoachConsoleConfig,
  pathname: string,
  clientName?: string,
): [string, string] {
  const clientMatch = pathname.match(new RegExp(`^${config.basePath}/clients/([^/]+)$`));
  if (clientMatch) {
    return [clientName ?? 'Client overview', 'Activity, history & offboarding'];
  }
  return config.pageTitles[pathname] ?? ['CoachTek', config.brandSubtitle];
}

export function coachDashboardQuickActions(config: CoachConsoleConfig) {
  const base = config.basePath;
  const actions = [
    {
      k: 'Invite link',
      description: 'Connect with new clients & team members',
      to: `${base}/invites`,
      icon: IconLink,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=640&q=80',
    },
  ];

  if (config.features.programLibrary) {
    actions.push({
      k: 'New program',
      description: 'Design structured fitness & training plans',
      to: `${base}/programs`,
      icon: IconLayers,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=640&q=80',
    });
  } else {
    actions.push({
      k: 'Assigned programs',
      description: 'Gym monthly packages assigned to you',
      to: `${base}/programs`,
      icon: IconLayers,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=640&q=80',
    });
  }

  if (config.features.payouts) {
    actions.push({
      k: 'Payouts & earnings',
      description: `${MOCK_EARNINGS.currency}${MOCK_EARNINGS.pending} pending · payout ${MOCK_EARNINGS.payoutDate}`,
      to: `${base}/payouts`,
      icon: IconWallet,
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=640&q=80',
    });
  }

  if (config.features.payroll) {
    actions.push({
      k: 'Monthly payment',
      description: 'Read-only gym payroll summary',
      to: `${base}/payroll`,
      icon: IconWallet,
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=640&q=80',
    });
  }

  return actions;
}
