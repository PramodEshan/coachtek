import { GYM_ADMIN_CONSOLE } from '@/config/roleConsoleConfig';
import { RoleConsoleLayout } from '@/layouts/RoleConsoleLayout';

export function GymAdminLayout() {
  return <RoleConsoleLayout config={GYM_ADMIN_CONSOLE} />;
}
