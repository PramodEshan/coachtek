import { BrowserRouter } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AuthProvider } from '@/context/AuthContext';
import { PageLoadingProvider } from '@/context/PageLoadingContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppRoutes } from '@/routes/AppRoutes';
import { InstallBanner } from '@/components/pwa/InstallBanner';
import { UpdateBanner } from '@/components/pwa/UpdateBanner';
import { OfflineNotice } from '@/components/pwa/OfflineNotice';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PageLoadingProvider>
            <AppRoutes />
          </PageLoadingProvider>
        </AuthProvider>
      </ThemeProvider>
      <InstallBanner />
      <UpdateBanner />
      <OfflineNotice />
      <SpeedInsights />
    </BrowserRouter>
  );
}
