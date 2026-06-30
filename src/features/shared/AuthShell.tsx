import { useCallback, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

interface AuthShellProps {
  children: ReactNode;
  heroTitle: ReactNode;
  heroSubtitle?: string;
  heroFeatures?: string[];
  heroImage?: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkTo?: string;
  mobileScrollLabel?: string;
}

export function AuthShell({
  children,
  heroTitle,
  heroSubtitle,
  heroFeatures,
  heroImage,
  footerText,
  footerLinkText,
  footerLinkTo,
  mobileScrollLabel = 'Log in',
}: AuthShellProps) {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="ct-auth-shell">
      <div className="ct-auth-theme-corner">
        <ThemeToggle variant="compact" />
      </div>

      <div className="ct-auth-split">
        <div className="ct-auth-hero">
          <Link to="/login" className="ct-auth-brand">Coachtek</Link>
          <h1 className="ct-auth-headline">{heroTitle}</h1>
          {heroSubtitle && (
            <p className="ct-auth-hero-sub">{heroSubtitle}</p>
          )}
          {heroFeatures && heroFeatures.length > 0 && (
            <ul className="ct-auth-hero-features">
              {heroFeatures.map((f) => (
                <li key={f}>
                  <span className="ct-auth-hero-check" aria-hidden="true">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
          )}
          {heroImage && (
            <div className="ct-auth-hero-img">
              <img src={heroImage} alt="" />
            </div>
          )}
          {footerText && footerLinkTo && (
            <Link to={footerLinkTo} className="ct-auth-hero-cta">
              <span className="ct-auth-hero-cta-label">{footerText}</span>
              <span className="ct-auth-hero-cta-link">
                {footerLinkText}
              </span>
            </Link>
          )}
          <div className="ct-auth-hero-btn-row">
            <button
              type="button"
              className="ct-auth-hero-scroll-btn"
              onClick={scrollToForm}
            >
              {mobileScrollLabel} &darr;
            </button>
            {footerLinkTo && (
              <Link to={footerLinkTo} className="ct-auth-hero-register-btn">
                Register
              </Link>
            )}
          </div>
        </div>

        <div className="ct-auth-form-panel" ref={formRef}>
          <div className="ct-auth-form-card">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
