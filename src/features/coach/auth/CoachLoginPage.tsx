import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { AuthShell } from '@/features/shared/AuthShell';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function CoachLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'alex@coachtek.app', password: 'coach123' },
  });

  return (
    <AuthShell
      heroTitle={<>Your coaching ecosystem, <span className="neon">simplified.</span></>}
      heroSubtitle="Manage clients, programs, subscriptions, and performance tracking — all from one powerful platform built for fitness professionals."
      footerText="Don't have an account?"
      footerLinkText="Click here to get started"
      footerLinkTo="/register"
    >
      <h2>Welcome Back</h2>

      <p style={{ color: 'var(--ct-text-muted)', marginBottom: 24, fontSize: 13 }}>
        Demo: alex@coachtek.app / coach123
      </p>

      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            await login(values);
            navigate('/solo-coach/dashboard');
          } catch (e) {
            setError('root', { message: e instanceof Error ? e.message : 'Login failed' });
          }
        })}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <div className="ct-field">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" placeholder="coach@coachtek.app" {...register('email')} />
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
