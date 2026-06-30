import { GYM_COACH_CONSOLE } from '@/config/coachConsoleConfig';
import { CoachLayout } from '@/layouts/CoachLayout';

export function GymCoachLayout() {
  return <CoachLayout config={GYM_COACH_CONSOLE} />;
}
