import { GYM_STAFF_CONSOLE } from '@/config/roleConsoleConfig';
import { RoleConsoleLayout } from '@/layouts/RoleConsoleLayout';

export function GymStaffLayout() {
  return <RoleConsoleLayout config={GYM_STAFF_CONSOLE} />;
}
