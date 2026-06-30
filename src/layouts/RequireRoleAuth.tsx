import { Navigate, Outlet } from 'react-router-dom';
import { ROLE_LOGIN_PATHS, ROLE_PATHS } from '@/config/roles';
import { useAuth } from '@/context/AuthContext';
import type { RoleKey } from '@/services/types';

export function RequireRoleAuth({ role }: { role: RoleKey }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="ct-auth-loading" aria-busy="true" aria-label="Loading" />;
  }
  if (!user) {
    return <Navigate to={ROLE_LOGIN_PATHS[role]} replace />;
  }
  if (user.role !== role) {
    return <Navigate to={ROLE_PATHS[user.role]} replace />;
  }
  return <Outlet />;
}
