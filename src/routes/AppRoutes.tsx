import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { RouteFallback } from '@/components/pwa/RouteFallback';

const CoachLayout = lazy(() => import('@/layouts/CoachLayout').then((m) => ({ default: m.CoachLayout })));
const ClientLayout = lazy(() => import('@/layouts/ClientLayout').then((m) => ({ default: m.ClientLayout })));
const GymAdminLayout = lazy(() => import('@/layouts/GymAdminLayout').then((m) => ({ default: m.GymAdminLayout })));
const GymStaffLayout = lazy(() => import('@/layouts/GymStaffLayout').then((m) => ({ default: m.GymStaffLayout })));
const OperatorLayout = lazy(() => import('@/layouts/OperatorLayout').then((m) => ({ default: m.OperatorLayout })));
const GymCoachLayout = lazy(() => import('@/layouts/GymCoachLayout').then((m) => ({ default: m.GymCoachLayout })));
const SuperAdminLayout = lazy(() => import('@/layouts/SuperAdminLayout').then((m) => ({ default: m.SuperAdminLayout })));

const RequireClientOnboarding = lazy(() => import('@/layouts/RequireClientOnboarding').then((m) => ({ default: m.RequireClientOnboarding })));
const RequireCoachAuth = lazy(() => import('@/layouts/RequireCoachAuth').then((m) => ({ default: m.RequireCoachAuth })));
const RequireRoleAuth = lazy(() => import('@/layouts/RequireRoleAuth').then((m) => ({ default: m.RequireRoleAuth })));

const CoachRegisterPage = lazy(() => import('@/features/coach/auth/CoachRegisterPage').then((m) => ({ default: m.CoachRegisterPage })));
const CoachOnboardingPendingPage = lazy(() => import('@/features/coach/auth/CoachOnboardingPendingPage').then((m) => ({ default: m.CoachOnboardingPendingPage })));

const CoachPages = () => import('@/features/coach/CoachPages');
const CoachDashboardPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachDashboardPage })));
const CoachTodayPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachTodayPage })));
const CoachCalendarPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachCalendarPage })));
const CoachClientsPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachClientsPage })));
const CoachClientDetailPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachClientDetailPage })));
const CoachMessagesPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachMessagesPage })));
const CoachProgramsPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachProgramsPage })));
const CoachPayoutsPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachPayoutsPage })));
const CoachInvitesPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachInvitesPage })));
const CoachProfilePage = lazy(() => CoachPages().then((m) => ({ default: m.CoachProfilePage })));
const CoachHelpPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachHelpPage })));
const CoachFeedbackPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachFeedbackPage })));
const GymCoachPayrollPage = lazy(() => CoachPages().then((m) => ({ default: m.GymCoachPayrollPage })));
const CoachCheckInDetailPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachCheckInDetailPage })));
const CoachSessionDetailPage = lazy(() => CoachPages().then((m) => ({ default: m.CoachSessionDetailPage })));
const SoloCoachProgramBuilder = lazy(() => import('@/features/coach/programs/SoloCoachProgramBuilder').then((m) => ({ default: m.SoloCoachProgramBuilder })));
const GymAdminProgramBuilder = lazy(() => import('@/features/gym/admin/GymAdminProgramBuilder').then((m) => ({ default: m.GymAdminProgramBuilder })));

const LoginPage = lazy(() => import('@/features/shared/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPathPage = lazy(() => import('@/features/shared/RegisterPathPage').then((m) => ({ default: m.RegisterPathPage })));
const ForgotPasswordPage = lazy(() => import('@/features/shared/AuthFlowPages').then((m) => ({ default: m.ForgotPasswordPage })));
const EmailVerificationPage = lazy(() => import('@/features/shared/AuthFlowPages').then((m) => ({ default: m.EmailVerificationPage })));
const GymRegisterPage = lazy(() => import('@/features/gym/auth/GymRegisterPage').then((m) => ({ default: m.GymRegisterPage })));
const GymRegisterPendingPage = lazy(() => import('@/features/gym/auth/GymRegisterPendingPage').then((m) => ({ default: m.GymRegisterPendingPage })));

const ClientPages = () => import('@/features/client/ClientPages');
const ClientRegisterPage = lazy(() => ClientPages().then((m) => ({ default: m.ClientRegisterPage })));
const ClientDashboardPage = lazy(() => ClientPages().then((m) => ({ default: m.ClientDashboardPage })));
const ClientMessagesPage = lazy(() => ClientPages().then((m) => ({ default: m.ClientMessagesPage })));
const ClientProgressPage = lazy(() => ClientPages().then((m) => ({ default: m.ClientProgressPage })));
const ClientProgressMetricsPage = lazy(() => ClientPages().then((m) => ({ default: m.ClientProgressMetricsPage })));
const ClientProgressPhotosPage = lazy(() => ClientPages().then((m) => ({ default: m.ClientProgressPhotosPage })));
const ClientSessionDetailPage = lazy(() => ClientPages().then((m) => ({ default: m.ClientSessionDetailPage })));
const ClientSettingsPage = lazy(() => ClientPages().then((m) => ({ default: m.ClientSettingsPage })));
const ClientSupportPage = lazy(() => ClientPages().then((m) => ({ default: m.ClientSupportPage })));
const ClientFeedbackPage = lazy(() => ClientPages().then((m) => ({ default: m.ClientFeedbackPage })));
const ClientTodayPage = lazy(() => ClientPages().then((m) => ({ default: m.ClientTodayPage })));
const ClientWorkoutLogPage = lazy(() => ClientPages().then((m) => ({ default: m.ClientWorkoutLogPage })));

const OperatorPages = () => import('@/features/operator/OperatorPages');
const OperatorDashboardPage = lazy(() => OperatorPages().then((m) => ({ default: m.OperatorDashboardPage })));
const OperatorAssignmentsPage = lazy(() => OperatorPages().then((m) => ({ default: m.OperatorAssignmentsPage })));
const OperatorComplaintsPage = lazy(() => OperatorPages().then((m) => ({ default: m.OperatorComplaintsPage })));
const OperatorComplaintDetailPage = lazy(() => OperatorPages().then((m) => ({ default: m.OperatorComplaintDetailPage })));
const OperatorOnboardingPage = lazy(() => OperatorPages().then((m) => ({ default: m.OperatorOnboardingPage })));
const OperatorGymsRegistryPage = lazy(() => OperatorPages().then((m) => ({ default: m.OperatorGymsRegistryPage })));
const OperatorSoloCoachesRegistryPage = lazy(() => OperatorPages().then((m) => ({ default: m.OperatorSoloCoachesRegistryPage })));
const OperatorTiersPage = lazy(() => OperatorPages().then((m) => ({ default: m.OperatorTiersPage })));
const OperatorVettingDetailPage = lazy(() => OperatorPages().then((m) => ({ default: m.OperatorVettingDetailPage })));

const GymAdminPages = () => import('@/features/gym/admin/GymAdminPages');
const GymAdminDashboardPage = lazy(() => GymAdminPages().then((m) => ({ default: m.GymAdminDashboardPage })));
const GymAdminCoachesPage = lazy(() => GymAdminPages().then((m) => ({ default: m.GymAdminCoachesPage })));
const GymAdminClientsPage = lazy(() => GymAdminPages().then((m) => ({ default: m.GymAdminClientsPage })));
const GymAdminProgramsPage = lazy(() => GymAdminPages().then((m) => ({ default: m.GymAdminProgramsPage })));
const GymAdminSchedulePage = lazy(() => GymAdminPages().then((m) => ({ default: m.GymAdminSchedulePage })));
const GymAdminStaffPage = lazy(() => GymAdminPages().then((m) => ({ default: m.GymAdminStaffPage })));
const GymAdminPaymentsPage = lazy(() => GymAdminPages().then((m) => ({ default: m.GymAdminPaymentsPage })));
const GymAdminCoachPayoutsPage = lazy(() => GymAdminPages().then((m) => ({ default: m.GymAdminCoachPayoutsPage })));
const GymAdminReviewsPage = lazy(() => GymAdminPages().then((m) => ({ default: m.GymAdminReviewsPage })));
const GymAdminReportsPage = lazy(() => GymAdminPages().then((m) => ({ default: m.GymAdminReportsPage })));
const GymAdminBillingPage = lazy(() => GymAdminPages().then((m) => ({ default: m.GymAdminBillingPage })));

const GymStaffPages = () => import('@/features/gym/staff/GymStaffPages');
const GymStaffTodayPage = lazy(() => GymStaffPages().then((m) => ({ default: m.GymStaffTodayPage })));
const GymStaffClientsPage = lazy(() => GymStaffPages().then((m) => ({ default: m.GymStaffClientsPage })));
const GymStaffPaymentsPage = lazy(() => GymStaffPages().then((m) => ({ default: m.GymStaffPaymentsPage })));
const GymStaffMessagesPage = lazy(() => GymStaffPages().then((m) => ({ default: m.GymStaffMessagesPage })));
const GymStaffHelpPage = lazy(() => GymStaffPages().then((m) => ({ default: m.GymStaffHelpPage })));

const SuperAdminPages = () => import('@/features/superadmin/SuperAdminPages');
const SuperAdminDashboardPage = lazy(() => SuperAdminPages().then((m) => ({ default: m.SuperAdminDashboardPage })));
const SuperAdminEscalationsPage = lazy(() => SuperAdminPages().then((m) => ({ default: m.SuperAdminEscalationsPage })));
const SuperAdminOperatorsPage = lazy(() => SuperAdminPages().then((m) => ({ default: m.SuperAdminOperatorsPage })));
const SuperAdminTiersPage = lazy(() => SuperAdminPages().then((m) => ({ default: m.SuperAdminTiersPage })));
const SuperAdminGymsPage = lazy(() => SuperAdminPages().then((m) => ({ default: m.SuperAdminGymsPage })));
const SuperAdminSoloCoachesPage = lazy(() => SuperAdminPages().then((m) => ({ default: m.SuperAdminSoloCoachesPage })));
const SuperAdminAuditPage = lazy(() => SuperAdminPages().then((m) => ({ default: m.SuperAdminAuditPage })));

function LegacyCoachRedirect() {
  const { pathname, search, hash } = useLocation();
  const next = pathname.replace(/^\/coach(?=\/|$)/, '/solo-coach');
  return <Navigate to={`${next}${search}${hash}`} replace />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPathPage />} />
        <Route path="/gym/register" element={<GymRegisterPage />} />
        <Route path="/gym/register/pending" element={<GymRegisterPendingPage />} />

        {/* Legacy coach URLs → solo-coach */}
        <Route path="/coach/*" element={<LegacyCoachRedirect />} />

        <Route path="/solo-coach/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/solo-coach/verify-email" element={<EmailVerificationPage />} />
        <Route path="/solo-coach/register" element={<CoachRegisterPage />} />
        <Route path="/solo-coach/onboarding-pending" element={<CoachOnboardingPendingPage />} />

        <Route element={<RequireCoachAuth />}>
          <Route path="/solo-coach" element={<CoachLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CoachDashboardPage />} />
            <Route path="today" element={<CoachTodayPage />} />
            <Route path="calendar" element={<CoachCalendarPage />} />
            <Route path="clients" element={<CoachClientsPage />} />
            <Route path="clients/:clientId" element={<CoachClientDetailPage />} />
            <Route path="clients/:clientId/check-ins/:logId" element={<CoachCheckInDetailPage />} />
            <Route path="clients/:clientId/sessions/:sessionId" element={<CoachSessionDetailPage />} />
            <Route path="messages" element={<CoachMessagesPage />} />
            <Route path="programs" element={<CoachProgramsPage />} />
            <Route path="programs/new" element={<SoloCoachProgramBuilder />} />
            <Route path="programs/:programId/edit" element={<SoloCoachProgramBuilder />} />
            <Route path="payouts" element={<CoachPayoutsPage />} />
            <Route path="invites" element={<CoachInvitesPage />} />
            <Route path="profile" element={<CoachProfilePage />} />
            <Route path="help" element={<CoachHelpPage />} />
            <Route path="feedback" element={<CoachFeedbackPage />} />
          </Route>
        </Route>

        <Route path="/client/register" element={<ClientRegisterPage />} />

        <Route element={<RequireRoleAuth role="client" />}>
          <Route element={<RequireClientOnboarding />}>
            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ClientDashboardPage />} />
              <Route path="today" element={<ClientTodayPage />} />
              <Route path="workout/log" element={<ClientWorkoutLogPage />} />
              <Route path="workout/:sessionId/log" element={<ClientWorkoutLogPage />} />
              <Route path="progress" element={<ClientProgressPage />} />
              <Route path="progress/metrics" element={<ClientProgressMetricsPage />} />
              <Route path="progress/photos" element={<ClientProgressPhotosPage />} />
              <Route path="sessions/:sessionId" element={<ClientSessionDetailPage />} />
              <Route path="messages" element={<ClientMessagesPage />} />
              <Route path="settings" element={<ClientSettingsPage />} />
              <Route path="support" element={<ClientSupportPage />} />
              <Route path="feedback/new" element={<ClientFeedbackPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<RequireRoleAuth role="operator" />}>
          <Route path="/operator" element={<OperatorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OperatorDashboardPage />} />
            <Route path="onboarding" element={<OperatorOnboardingPage />} />
            <Route path="onboarding/solo-coaches/:coachId" element={<OperatorVettingDetailPage />} />
            <Route path="vetting" element={<Navigate to="/operator/onboarding?tab=solo-coaches" replace />} />
            <Route path="vetting/:coachId" element={<OperatorVettingDetailPage />} />
            <Route path="assignments" element={<OperatorAssignmentsPage />} />
            <Route path="complaints" element={<OperatorComplaintsPage />} />
            <Route path="complaints/:complaintId" element={<OperatorComplaintDetailPage />} />
            <Route path="tiers" element={<OperatorTiersPage />} />
            <Route path="registries/gyms" element={<OperatorGymsRegistryPage />} />
            <Route path="registries/solo-coaches" element={<OperatorSoloCoachesRegistryPage />} />
          </Route>
        </Route>

        <Route element={<RequireRoleAuth role="gym_admin" />}>
          <Route path="/gym/admin" element={<GymAdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<GymAdminDashboardPage />} />
            <Route path="coaches" element={<GymAdminCoachesPage />} />
            <Route path="clients" element={<GymAdminClientsPage />} />
            <Route path="programs" element={<GymAdminProgramsPage />} />
            <Route path="programs/new" element={<GymAdminProgramBuilder />} />
            <Route path="programs/:programId/edit" element={<GymAdminProgramBuilder />} />
            <Route path="schedule" element={<GymAdminSchedulePage />} />
            <Route path="staff" element={<GymAdminStaffPage />} />
            <Route path="payments" element={<GymAdminPaymentsPage />} />
            <Route path="coach-payouts" element={<GymAdminCoachPayoutsPage />} />
            <Route path="reviews" element={<GymAdminReviewsPage />} />
            <Route path="reports" element={<GymAdminReportsPage />} />
            <Route path="billing" element={<GymAdminBillingPage />} />
          </Route>
        </Route>

        <Route element={<RequireRoleAuth role="gym_coach" />}>
          <Route path="/gym/coach" element={<GymCoachLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CoachDashboardPage />} />
            <Route path="today" element={<CoachTodayPage />} />
            <Route path="programs" element={<CoachProgramsPage />} />
            <Route path="clients" element={<CoachClientsPage />} />
            <Route path="clients/:clientId" element={<CoachClientDetailPage />} />
            <Route path="clients/:clientId/check-ins/:logId" element={<CoachCheckInDetailPage />} />
            <Route path="clients/:clientId/sessions/:sessionId" element={<CoachSessionDetailPage />} />
            <Route path="messages" element={<CoachMessagesPage />} />
            <Route path="feedback" element={<CoachFeedbackPage />} />
            <Route path="invites" element={<CoachInvitesPage />} />
            <Route path="profile" element={<CoachProfilePage />} />
            <Route path="help" element={<CoachHelpPage />} />
            <Route path="payroll" element={<GymCoachPayrollPage />} />
          </Route>
        </Route>

        <Route element={<RequireRoleAuth role="gym_staff" />}>
          <Route path="/gym/staff" element={<GymStaffLayout />}>
            <Route index element={<Navigate to="today" replace />} />
            <Route path="today" element={<GymStaffTodayPage />} />
            <Route path="clients" element={<GymStaffClientsPage />} />
            <Route path="payments" element={<GymStaffPaymentsPage />} />
            <Route path="messages" element={<GymStaffMessagesPage />} />
            <Route path="help" element={<GymStaffHelpPage />} />
          </Route>
        </Route>

        <Route element={<RequireRoleAuth role="superadmin" />}>
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdminDashboardPage />} />
            <Route path="escalations" element={<SuperAdminEscalationsPage />} />
            <Route path="operators" element={<SuperAdminOperatorsPage />} />
            <Route path="tiers" element={<SuperAdminTiersPage />} />
            <Route path="gyms" element={<SuperAdminGymsPage />} />
            <Route path="solo-coaches" element={<SuperAdminSoloCoachesPage />} />
            <Route path="audit" element={<SuperAdminAuditPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
