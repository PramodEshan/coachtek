import { CLIENT_CONSOLE } from '@/config/roleConsoleConfig';
import { RoleConsoleLayout } from '@/layouts/RoleConsoleLayout';

export function ClientLayout() {
  return <RoleConsoleLayout config={CLIENT_CONSOLE} />;
}
