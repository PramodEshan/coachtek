import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { AuthShell } from '@/features/shared/AuthShell';

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
    <AuthShell
      heroTitle={<>Build, scale, and <span className="neon">dominate.</span></>}
      heroSubtitle="Centralize your coaching business — manage clients, programs, subscriptions, and performance tracking from one platform designed for growth."
      heroFeatures={['Client management', 'Program builder', 'Performance analytics', 'Subscription billing']}
      footerText="Already have an account?"
      footerLinkText="Click here to sign in"
      footerLinkTo="/login"
    >
      <div className="ct-auth-badge">Coach registration</div>
      <h2>Create your account</h2>

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
          <input id="name" placeholder="Enter your full name" {...register('name')} />
          {errors.name && <span className="ct-field-error">{errors.name.message}</span>}
        </div>
        <div className="ct-field">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" placeholder="coach@example.com" {...register('email')} />
          {errors.email && <span className="ct-field-error">{errors.email.message}</span>}
        </div>
        <div className="ct-field">
          <label htmlFor="specialty">Specialty (optional)</label>
          <input id="specialty" placeholder="e.g. Strength & Conditioning" {...register('specialty')} />
        </div>
        <div className="ct-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && <span className="ct-field-error">{errors.password.message}</span>}
        </div>
        <div className="ct-field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <span className="ct-field-error">{errors.confirmPassword.message}</span>}
        </div>
        {errors.root && <span className="ct-field-error">{errors.root.message}</span>}
        <button className="ct-auth-cta ct-press" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Continue →'}
        </button>
      </form>

      <p style={{ marginTop: 16, fontSize: 13, color: 'var(--ct-text-muted)' }}>
        Looking to register a gym instead?{' '}
        <Link to="/gym/register" style={{ color: 'var(--ct-neon-dark)', fontWeight: 600, textDecoration: 'none' }}>Register GYM</Link>
      </p>
    </AuthShell>
  );
}
