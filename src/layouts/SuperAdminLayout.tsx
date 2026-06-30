import { SUPERADMIN_CONSOLE } from '@/config/roleConsoleConfig';
import { RoleConsoleLayout } from '@/layouts/RoleConsoleLayout';

export function SuperAdminLayout() {
  return <RoleConsoleLayout config={SUPERADMIN_CONSOLE} />;
}
