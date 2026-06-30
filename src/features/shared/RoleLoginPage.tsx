import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Panel } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ROLE_LABELS } from '@/config/roles';
import { useAuth } from '@/context/AuthContext';
import type { RoleKey } from '@/services/types';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

const DEMO_HINTS: Partial<Record<RoleKey, { email: string; password: string; register?: string }>> = {
  client: { email: 'jordan@client.demo', password: 'demo123', register: '/client/register' },
  operator: { email: 'ops@coachtek.app', password: 'demo123' },
  gym_admin: { email: 'gym@coachtek.app', password: 'demo123' },
  gym_staff: { email: 'staff@gym.demo', password: 'demo123' },
  superadmin: { email: 'admin@coachtek.app', password: 'demo123' },
};

export function RoleLoginPage({
  role,
  dashboardPath,
  registerPath,
}: {
  role: RoleKey;
  dashboardPath: string;
  registerPath?: string;
}) {
  const { loginAsRole } = useAuth();
  const navigate = useNavigate();
  const hint = DEMO_HINTS[role];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: hint?.email ?? '', password: hint?.password ?? '' },
  });

  return (
    <div className="ct-auth-layout">
      <div className="ct-auth-theme-corner">
        <ThemeToggle variant="compact" />
      </div>
      <Panel className="ct-auth-card">
        <div className="ct-panel-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div className="ct-brand-mark">CT</div>
            <div>
              <div style={{ fontFamily: 'var(--ct-font-display)', fontWeight: 700 }}>CoachTek</div>
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>{ROLE_LABELS[role]} sign in</div>
            </div>
          </div>
          {hint ? (
            <p style={{ color: 'var(--ct-text-muted)', marginBottom: 24, fontSize: 14 }}>
              Demo: {hint.email} / {hint.password}
            </p>
          ) : null}
          <form
            onSubmit={handleSubmit(async (values) => {
              try {
                await loginAsRole(role, values);
                navigate(dashboardPath);
              } catch (e) {
                setError('root', { message: e instanceof Error ? e.message : 'Login failed' });
              }
            })}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div className="ct-field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" {...register('email')} />
              {errors.email ? <span className="ct-field-error">{errors.email.message}</span> : null}
            </div>
            <div className="ct-field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" {...register('password')} />
              {errors.password ? <span className="ct-field-error">{errors.password.message}</span> : null}
            </div>
            {errors.root ? <span className="ct-field-error">{errors.root.message}</span> : null}
            <button className="ct-btn-primary ct-btn-primary-lg ct-press" type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          {registerPath ? (
            <p style={{ marginTop: 20, color: 'var(--ct-text-muted)', fontSize: 14 }}>
              New account?{' '}
              <Link to={registerPath} style={{ color: 'var(--ct-accent)', fontWeight: 600 }}>
                Create account
              </Link>
            </p>
          ) : null}
        </div>
      </Panel>
    </div>
  );
}
