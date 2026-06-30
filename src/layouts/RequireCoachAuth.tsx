import { Navigate, Outlet } from 'react-router-dom';
import { ROLE_LOGIN_PATHS, ROLE_PATHS } from '@/config/roles';
import { useAuth } from '@/context/AuthContext';

export function RequireCoachAuth() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="ct-auth-loading" aria-busy="true" aria-label="Loading" />;
  }
  if (!user) return <Navigate to={ROLE_LOGIN_PATHS.solo_coach} replace />;
  if (user.role !== 'solo_coach') {
    return <Navigate to={ROLE_PATHS[user.role]} replace />;
  }
  return <Outlet />;
}
