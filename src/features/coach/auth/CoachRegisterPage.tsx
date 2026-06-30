import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Panel } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

const schema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    specialty: z.string().optional(),
    password: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function CoachRegisterPage() {
  const { register: registerCoach } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
      <div className="ct-auth-layout">
      <div className="ct-auth-theme-corner">
        <ThemeToggle variant="compact" />
      </div>
      <Panel className="ct-auth-card">
        <div className="ct-panel-body">
          <h1>Coach registration</h1>
          <p style={{ color: 'var(--ct-text-muted)', marginBottom: 24 }}>
            Submit your profile for review before accessing the console.
          </p>
          <form
            onSubmit={handleSubmit(async (values) => {
              try {
                await registerCoach(values);
                navigate('/solo-coach/verify-email');
              } catch (e) {
                setError('root', { message: e instanceof Error ? e.message : 'Registration failed' });
              }
            })}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div className="ct-field">
              <label htmlFor="name">Full name</label>
              <input id="name" {...register('name')} />
              {errors.name ? <span className="ct-field-error">{errors.name.message}</span> : null}
            </div>
            <div className="ct-field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" {...register('email')} />
              {errors.email ? <span className="ct-field-error">{errors.email.message}</span> : null}
            </div>
            <div className="ct-field">
              <label htmlFor="specialty">Specialty (optional)</label>
              <input id="specialty" {...register('specialty')} />
            </div>
            <div className="ct-field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" {...register('password')} />
              {errors.password ? <span className="ct-field-error">{errors.password.message}</span> : null}
            </div>
            <div className="ct-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input id="confirmPassword" type="password" {...register('confirmPassword')} />
              {errors.confirmPassword ? <span className="ct-field-error">{errors.confirmPassword.message}</span> : null}
            </div>
            {errors.root ? <span className="ct-field-error">{errors.root.message}</span> : null}
            <button className="ct-btn-primary ct-btn-primary-lg ct-press" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit for review'}
            </button>
          </form>
          <p style={{ marginTop: 20, color: 'var(--ct-text-muted)' }}>
            Already registered? <Link to="/solo-coach/login" style={{ color: 'var(--ct-accent)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </Panel>
    </div>
  );
}
