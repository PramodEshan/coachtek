import { useLocation, useNavigationType } from 'react-router-dom';

interface PageSlideTransitionProps {
  children: React.ReactNode;
}

export function PageSlideTransition({ children }: PageSlideTransitionProps) {
  const location = useLocation();
  const navigationType = useNavigationType();

  const animationClass =
    navigationType === 'POP' ? 'ct-slide-enter-back' : 'ct-slide-enter-forward';

  return (
    <div key={location.key} className={animationClass}>
      {children}
    </div>
  );
}
