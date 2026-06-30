import type { ComponentType } from 'react';

export interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  detail?: string;
  badge?: number;
  shortLabel?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface SettingsNavItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
}
