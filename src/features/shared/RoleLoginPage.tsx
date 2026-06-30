import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ROLE_LABELS } from '@/config/roles';
import { useAuth } from '@/context/AuthContext';
import { AuthShell } from '@/features/shared/AuthShell';
import type { RoleKey } from '@/services/types';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

const DEMO_HINTS: Partial<Record<RoleKey, { email: string; password: string }>> = {
  client: { email: 'jordan@client.demo', password: 'demo123' },
  operator: { email: 'ops@coachtek.app', password: 'demo123' },
  gym_admin: { email: 'gym@coachtek.app', password: 'demo123' },
  gym_staff: { email: 'staff@gym.demo', password: 'demo123' },
  superadmin: { email: 'admin@coachtek.app', password: 'demo123' },
};

const HERO_COPY: Partial<Record<RoleKey, { title: React.ReactNode; sub: string }>> = {
  client: {
    title: <>Your fitness journey, <span className="neon">centralized.</span></>,
    sub: 'Track workouts, monitor progress, and stay connected with your coach — accountability and results in one place.',
  },
  gym_admin: {
    title: <>Run your gym, <span className="neon">effortlessly.</span></>,
    sub: 'Manage coaches, clients, schedules, and subscriptions from a single centralized console.',
  },
  gym_coach: {
    title: <>Coach with <span className="neon">precision.</span></>,
    sub: 'Deliver gym-assigned programs, track client performance, and streamline communication.',
  },
  gym_staff: {
    title: <>Operations, <span className="neon">streamlined.</span></>,
    sub: 'Handle check-ins, payments, and day-to-day gym operations at your fingertips.',
  },
  operator: {
    title: <>Platform <span className="neon">operations.</span></>,
    sub: 'Onboard gyms, vet coaches, and provide operational oversight across the CoachTek ecosystem.',
  },
  superadmin: {
    title: <>Platform <span className="neon">governance.</span></>,
    sub: 'Full administrative control, escalation management, and system-wide oversight.',
  },
};

export function RoleLoginPage({
  role,
  dashboardPath,
}: {
  role: RoleKey;
  dashboardPath: string;
  registerPath?: string;
}) {
  const { loginAsRole } = useAuth();
  const navigate = useNavigate();
  const hint = DEMO_HINTS[role];
  const hero = HERO_COPY[role] ?? {
    title: <>Welcome <span className="neon">back.</span></>,
    sub: `Sign in as ${ROLE_LABELS[role]}.`,
  };

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
    <AuthShell
      heroTitle={hero.title}
      heroSubtitle={hero.sub}
      footerText="Don't have an account?"
      footerLinkText="Click here to get started"
      footerLinkTo="/register"
    >
      <h2>{ROLE_LABELS[role]} sign in</h2>

      {hint && (
        <p style={{ color: 'var(--ct-text-muted)', marginBottom: 24, fontSize: 13 }}>
          Demo: {hint.email} / {hint.password}
        </p>
      )}

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
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <span className="ct-field-error">{errors.email.message}</span>}
        </div>
        <div className="ct-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && <span className="ct-field-error">{errors.password.message}</span>}
        </div>

        <div className="ct-auth-row">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <Link to="/solo-coach/forgot-password">Forgot password?</Link>
        </div>

        {errors.root && <span className="ct-field-error">{errors.root.message}</span>}

        <button className="ct-auth-cta ct-press" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Start session'}
        </button>
      </form>
    </AuthShell>
  );
}
