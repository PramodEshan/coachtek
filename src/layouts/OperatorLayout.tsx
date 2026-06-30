import { OPERATOR_CONSOLE } from '@/config/roleConsoleConfig';
import { RoleConsoleLayout } from '@/layouts/RoleConsoleLayout';

export function OperatorLayout() {
  return <RoleConsoleLayout config={OPERATOR_CONSOLE} />;
}
