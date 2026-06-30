import {
  IconAlert,
  IconCalendar,
  IconCheck,
  IconClients,
  IconClock,
  IconDashboard,
  IconHeart,
  IconLayers,
  IconMessage,
  IconUser,
  IconWallet,
} from '@/components/icons';
import type { NavSection, SettingsNavItem } from '@/config/navTypes';
import type { RoleKey } from '@/services/types';

export interface RoleConsoleConfig {
  role: RoleKey;
  brandSubtitle: string;
  loginPath: string;
  dashboardPath: string;
  profilePath?: string;
  loadingKey: string;
  navSections: NavSection[];
  mobilePrimaryPaths: readonly string[];
  settingsItems: SettingsNavItem[];
  pageTitles: Record<string, [string, string]>;
  welcomeTitle?: (firstName: string) => string;
  mainSurfacePaths?: string[];
  immersivePathPatterns?: RegExp[];
}

export const CLIENT_CONSOLE: RoleConsoleConfig = {
  role: 'client',
  brandSubtitle: 'Client app',
  loginPath: '/client/login',
  dashboardPath: '/client/dashboard',
  profilePath: '/client/settings',
  loadingKey: 'client-main',
  navSections: [
    {
      title: 'Journey',
      items: [
        { to: '/client/dashboard', label: 'Home', shortLabel: 'Home', icon: IconDashboard },
        { to: '/client/today', label: "Today's workout", shortLabel: 'Today', icon: IconClock, detail: 'Lower body' },
        { to: '/client/progress', label: 'Progress', shortLabel: 'Progress', icon: IconLayers },
        { to: '/client/messages', label: 'WhatsApp', shortLabel: 'Coach', icon: IconMessage },
      ],
    },
    {
      title: 'Account',
      items: [{ to: '/client/settings', label: 'Profile & settings', shortLabel: 'Profile', icon: IconUser }],
    },
  ],
  mobilePrimaryPaths: ['/client/dashboard', '/client/today', '/client/progress', '/client/messages', '/client/settings'],
  settingsItems: [
    { to: '/client/settings', label: 'Profile settings', icon: IconUser },
    { to: '/client/support', label: 'Help & support', icon: IconHeart },
  ],
  pageTitles: {
    '/client/dashboard': ['Home', 'Your fitness journey'],
    '/client/today': ["Today's workout", 'Lower body strength'],
    '/client/progress': ['Progress', 'Streaks, metrics & photos'],
    '/client/messages': ['WhatsApp', 'Message your coach'],
    '/client/settings': ['Settings', 'Profile, subscription & data'],
    '/client/support': ['Support', 'Contact platform operator'],
    '/client/feedback/new': ['Feedback', 'Submit feedback or complaint'],
  },
  welcomeTitle: (name) => `Welcome back, ${name}`,
};

export const OPERATOR_CONSOLE: RoleConsoleConfig = {
  role: 'operator',
  brandSubtitle: 'Platform operator',
  loginPath: '/operator/login',
  dashboardPath: '/operator/dashboard',
  loadingKey: 'operator-main',
  navSections: [
    {
      title: 'Operations',
      items: [
        { to: '/operator/dashboard', label: 'Dashboard', icon: IconDashboard },
        { to: '/operator/onboarding', label: 'Platform onboarding', icon: IconCheck, badge: 2 },
        { to: '/operator/assignments', label: 'Assignments', icon: IconClients },
        { to: '/operator/complaints', label: 'Complaints', icon: IconAlert, badge: 3 },
        { to: '/operator/tiers', label: 'Subscription tiers', icon: IconWallet },
      ],
    },
    {
      title: 'Registries',
      items: [
        { to: '/operator/registries/gyms', label: 'Gyms', icon: IconLayers },
        { to: '/operator/registries/solo-coaches', label: 'Solo coaches', icon: IconUser },
      ],
    },
  ],
  mobilePrimaryPaths: ['/operator/dashboard', '/operator/onboarding', '/operator/assignments', '/operator/complaints', '/operator/tiers'],
  settingsItems: [],
  pageTitles: {
    '/operator/dashboard': ['Operator dashboard', 'Platform overview'],
    '/operator/onboarding': ['Platform onboarding', 'Register gyms & vet solo coaches'],
    '/operator/assignments': ['Assignments', 'Coach–client relationships'],
    '/operator/complaints': ['Complaints', 'Platform complaint inbox'],
    '/operator/tiers': ['Subscription tiers', 'Pricing & limits'],
    '/operator/registries/gyms': ['Gym registry', 'Active & suspended gyms'],
    '/operator/registries/solo-coaches': ['Solo coach registry', 'Active & suspended solo coaches'],
  },
  welcomeTitle: (name) => `Welcome, ${name}`,
};

export const GYM_ADMIN_CONSOLE: RoleConsoleConfig = {
  role: 'gym_admin',
  brandSubtitle: 'Gym admin',
  loginPath: '/gym/admin/login',
  dashboardPath: '/gym/admin/dashboard',
  loadingKey: 'gym-admin-main',
  immersivePathPatterns: [/\/programs\/(new|[^/]+\/edit)$/],
  navSections: [
    {
      title: 'Gym',
      items: [
        { to: '/gym/admin/dashboard', label: 'Dashboard', icon: IconDashboard },
        { to: '/gym/admin/coaches', label: 'Coaches', icon: IconUser, detail: '3 active' },
        { to: '/gym/admin/clients', label: 'Clients', icon: IconClients },
        { to: '/gym/admin/programs', label: 'Program library', icon: IconLayers, detail: '3 packages' },
        { to: '/gym/admin/schedule', label: 'Schedule', icon: IconCalendar },
        { to: '/gym/admin/staff', label: 'Staff', icon: IconCheck },
        { to: '/gym/admin/payments', label: 'Client payments', icon: IconWallet },
        { to: '/gym/admin/coach-payouts', label: 'Coach payouts', icon: IconWallet },
        { to: '/gym/admin/reviews', label: 'Reviews', icon: IconAlert },
        { to: '/gym/admin/reports', label: 'Reports', icon: IconLayers },
      ],
    },
  ],
  mobilePrimaryPaths: ['/gym/admin/dashboard', '/gym/admin/coaches', '/gym/admin/clients', '/gym/admin/programs', '/gym/admin/payments'],
  settingsItems: [
    { to: '/gym/admin/billing', label: 'Billing & subscription', icon: IconWallet },
  ],
  pageTitles: {
    '/gym/admin/dashboard': ['Gym dashboard', 'Iron District Fitness'],
    '/gym/admin/coaches': ['Coaches', 'Gym-affiliated coaches'],
    '/gym/admin/clients': ['Clients', 'Aggregate roster'],
    '/gym/admin/programs': ['Program library', 'Monthly packages & coach assignments'],
    '/gym/admin/schedule': ['Schedule', 'Gym-wide sessions'],
    '/gym/admin/staff': ['Staff', 'Gym staff accounts'],
    '/gym/admin/payments': ['Client payments', 'Gym client billing'],
    '/gym/admin/coach-payouts': ['Coach payouts', 'Gym coach payroll'],
    '/gym/admin/reviews': ['Reviews', 'Coach & client profile review'],
    '/gym/admin/reports': ['Reports', 'Activity summary'],
    '/gym/admin/billing': ['Billing', 'Gym subscription'],
  },
  welcomeTitle: (name) => `Welcome, ${name}`,
};

export const GYM_STAFF_CONSOLE: RoleConsoleConfig = {
  role: 'gym_staff',
  brandSubtitle: 'Gym staff',
  loginPath: '/gym/staff/login',
  dashboardPath: '/gym/staff/today',
  loadingKey: 'gym-staff-main',
  navSections: [
    {
      title: 'Front desk',
      items: [
        { to: '/gym/staff/today', label: 'Today', icon: IconClock },
        { to: '/gym/staff/clients', label: 'Clients', icon: IconClients },
        { to: '/gym/staff/payments', label: 'Payments', icon: IconWallet },
        { to: '/gym/staff/messages', label: 'Messages', icon: IconMessage },
        { to: '/gym/staff/help', label: 'Help', icon: IconHeart },
      ],
    },
  ],
  mobilePrimaryPaths: ['/gym/staff/today', '/gym/staff/clients', '/gym/staff/payments', '/gym/staff/messages', '/gym/staff/help'],
  settingsItems: [],
  pageTitles: {
    '/gym/staff/today': ['Today', 'Gym schedule'],
    '/gym/staff/clients': ['Clients', 'Check-in status'],
    '/gym/staff/payments': ['Payments', 'Client payment status'],
    '/gym/staff/messages': ['Messages', 'Gym support'],
    '/gym/staff/help': ['Help', 'Staff resources'],
  },
  welcomeTitle: (name) => `Welcome, ${name}`,
};

export const SUPERADMIN_CONSOLE: RoleConsoleConfig = {
  role: 'superadmin',
  brandSubtitle: 'Super admin',
  loginPath: '/superadmin/login',
  dashboardPath: '/superadmin/dashboard',
  loadingKey: 'superadmin-main',
  navSections: [
    {
      title: 'Platform',
      items: [
        { to: '/superadmin/dashboard', label: 'Dashboard', icon: IconDashboard },
        { to: '/superadmin/escalations', label: 'Escalations', icon: IconAlert, badge: 1 },
        { to: '/superadmin/operators', label: 'Operators', icon: IconUser },
        { to: '/superadmin/tiers', label: 'Tiers & pricing', icon: IconWallet },
        { to: '/superadmin/gyms', label: 'Gyms', icon: IconLayers },
        { to: '/superadmin/solo-coaches', label: 'Solo coaches', icon: IconClients },
        { to: '/superadmin/audit', label: 'Audit log', icon: IconCheck },
      ],
    },
  ],
  mobilePrimaryPaths: ['/superadmin/dashboard', '/superadmin/escalations', '/superadmin/operators', '/superadmin/gyms', '/superadmin/audit'],
  settingsItems: [],
  pageTitles: {
    '/superadmin/dashboard': ['Super admin', 'Platform health'],
    '/superadmin/escalations': ['Escalations', 'Escalated complaints'],
    '/superadmin/operators': ['Operators', 'Platform operator accounts'],
    '/superadmin/tiers': ['Tiers & pricing', 'Global subscription config'],
    '/superadmin/gyms': ['Gyms', 'Deactivate & override'],
    '/superadmin/solo-coaches': ['Solo coaches', 'Deactivate & override'],
    '/superadmin/audit': ['Audit log', 'Platform activity'],
  },
  welcomeTitle: (name) => `Welcome, ${name}`,
};

export function rolePageTitle(config: RoleConsoleConfig, pathname: string): [string, string] {
  if (config.pageTitles[pathname]) return config.pageTitles[pathname];
  const dynamic = Object.entries(config.pageTitles).find(([path]) => pathname.startsWith(`${path}/`));
  if (dynamic) return dynamic[1];
  return ['CoachTek', config.brandSubtitle];
}

export function roleMobileNavItems(config: RoleConsoleConfig) {
  return config.navSections.flatMap((s) => s.items);
}

export function roleMobilePrimaryItems(config: RoleConsoleConfig) {
  const items = roleMobileNavItems(config);
  return config.mobilePrimaryPaths.map((path) => {
    const item = items.find((e) => e.to === path);
    if (!item) throw new Error(`Missing mobile nav: ${path}`);
    return item;
  });
}

export function isRoleMobileMoreRoute(config: RoleConsoleConfig, pathname: string): boolean {
  const prefixes: Record<RoleKey, string> = {
    solo_coach: '/solo-coach',
    gym_coach: '/gym/coach',
    client: '/client',
    gym_admin: '/gym/admin',
    gym_staff: '/gym/staff',
    operator: '/operator',
    superadmin: '/superadmin',
  };
  const base = prefixes[config.role];
  if (!pathname.startsWith(base)) return false;
  return !config.mobilePrimaryPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
