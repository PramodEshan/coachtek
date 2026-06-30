import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {children}
    </svg>
  );
}

export function IconDashboard(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Icon>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </Icon>
  );
}

export function IconClients(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20c0-3.3 3.1-5 7-5s7 1.7 7 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 20c.4-2.2 2.4-3.5 4.5-3.5" />
    </Icon>
  );
}

export function IconMessage(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 5h16v11H8l-4 4V5z" />
    </Icon>
  );
}

export function IconWallet(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M16 14h3" />
    </Icon>
  );
}

export function IconLayers(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3 3 8l9 5 9-5-9-5z" />
      <path d="M3 12l9 5 9-5M3 16l9 5 9-5" />
    </Icon>
  );
}

export function IconLink(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 14a4 4 0 0 1 0-5.7l1.4-1.4a4 4 0 0 1 5.7 5.7l-1 1" />
      <path d="M14 10a4 4 0 0 1 0 5.7l-1.4 1.4a4 4 0 0 1-5.7-5.7l1-1" />
    </Icon>
  );
}

export function IconBell(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4a4 4 0 0 1 4 4v3l2 2H6l2-2V8a4 4 0 0 1 4-4z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </Icon>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" />
    </Icon>
  );
}

export function IconUser(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </Icon>
  );
}

export function IconSwitch(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16 3h5v5M8 21H3v-5M21 3l-7 7M3 21l7-7" />
    </Icon>
  );
}

export function IconLogout(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 4H4v16h6M15 12H8M18 8l4 4-4 4" />
    </Icon>
  );
}

export function IconChevRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  );
}

export function IconChevLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Icon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l4 4" />
    </Icon>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4 3 20h18L12 4z" />
      <path d="M12 10v4M12 17h.01" />
    </Icon>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12l4 4 10-10" />
    </Icon>
  );
}

export function IconSend(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </Icon>
  );
}

export function IconEdit(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </Icon>
  );
}

export function IconTrendUp(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 16l6-6 4 4 6-8" />
      <path d="M14 6h6v6" />
    </Icon>
  );
}

export function IconTrendDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 8l6 6 4-4 6 8" />
      <path d="M14 18h6v-6" />
    </Icon>
  );
}

export function IconMark(props: IconProps) {
  return (
    <Icon {...props} strokeWidth="2.2">
      <path d="M7 12l3 3 7-7" />
    </Icon>
  );
}

export function IconSun(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </Icon>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 7 7 0 1 0 20 14.5z" />
    </Icon>
  );
}

export function IconMore(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="5" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.25" fill="currentColor" stroke="none" />
    </Icon>
  );
}
