import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthShell } from '@/features/shared/AuthShell';

const SPECIALTIES = [
  'Strength & Conditioning',
  'CrossFit',
  'Yoga & Mobility',
  'Martial Arts',
  'Rehabilitation',
  'General Fitness',
];

const schema = z
  .object({
    leadCoachName: z.string().min(2, 'Name is required'),
    specialty: z.string().min(1, 'Select a specialty'),
    gymName: z.string().min(2, 'Gym name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function GymRegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <AuthShell
      heroTitle={<>Scale your gym <span className="neon">digitally.</span></>}
      heroSubtitle="Centralize coach management, client onboarding, class scheduling, and subscription billing — all under one roof."
      heroFeatures={['Multi-coach management', 'Client retention tools', 'Subscription billing', 'Performance dashboards']}
      footerText="Already registered?"
      footerLinkText="Click here to sign in"
      footerLinkTo="/login"
    >
      <div className="ct-auth-badge">Gym registration</div>
      <h2>Register Your GYM</h2>

      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            setServerError(null);
            const { delay } = await import('@/services/mock/store');
            await delay();
            void values;
            navigate('/gym/register/pending');
          } catch (e) {
            setServerError(e instanceof Error ? e.message : 'Registration failed');
          }
        })}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <div className="ct-field">
          <label htmlFor="leadCoachName">Lead coach full name</label>
          <input id="leadCoachName" placeholder="e.g. Marcus Vane" {...register('leadCoachName')} />
          {errors.leadCoachName && <span className="ct-field-error">{errors.leadCoachName.message}</span>}
        </div>

        <div className="ct-field">
          <label htmlFor="specialty">Professional specialty</label>
          <select id="specialty" {...register('specialty')} defaultValue="">
            <option value="" disabled>Select your focus</option>
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.specialty && <span className="ct-field-error">{errors.specialty.message}</span>}
        </div>

        <div className="ct-field">
          <label htmlFor="gymName">Gym / Studio name</label>
          <input id="gymName" placeholder="e.g. Iron Forge Athletics" {...register('gymName')} />
          {errors.gymName && <span className="ct-field-error">{errors.gymName.message}</span>}
        </div>

        <div className="ct-field">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" placeholder="admin@yourgym.com" {...register('email')} />
          {errors.email && <span className="ct-field-error">{errors.email.message}</span>}
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

        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--ct-text-muted)', cursor: 'pointer' }}>
          <input type="checkbox" {...register('terms')} style={{ marginTop: 3 }} />
          <span>
            I agree to the{' '}
            <span style={{ color: 'var(--ct-neon-dark)', fontWeight: 600 }}>Coach Professional Terms</span>{' '}
            and understand my data will be used to create my digital gym shell.
          </span>
        </label>
        {errors.terms && <span className="ct-field-error">{errors.terms.message}</span>}

        {serverError && <span className="ct-field-error">{serverError}</span>}

        <button type="submit" className="ct-auth-cta ct-press" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Continue →'}
        </button>
      </form>
    </AuthShell>
  );
}
