import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Panel } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

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
              <div style={{ fontSize: 12, color: 'var(--ct-text-muted)' }}>Solo coach sign in</div>
            </div>
          </div>
          <p style={{ color: 'var(--ct-text-muted)', marginBottom: 24, fontSize: 14 }}>
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
          <p style={{ marginTop: 12, fontSize: 14 }}>
            <Link to="/solo-coach/forgot-password" style={{ color: 'var(--ct-accent)', fontWeight: 600 }}>
              Forgot password?
            </Link>
          </p>
          <p style={{ marginTop: 20, color: 'var(--ct-text-muted)', fontSize: 14 }}>
            New coach? <Link to="/solo-coach/register" style={{ color: 'var(--ct-accent)', fontWeight: 600 }}>Create account</Link>
          </p>
        </div>
      </Panel>
    </div>
  );
}
