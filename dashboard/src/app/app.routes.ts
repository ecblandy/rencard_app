import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { authRoutes } from './features/auth/routes/auth.routes';
import { sessionResolver } from './features/auth/session/session-resolver';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { clientRoutes } from './features/(users)/client/routes/client.routes';
import { protectedGuard } from './features/auth/guard/protected/protected-guard';
import { onboardingRoutes } from './features/(users)/client/pages/onboarding/onboarding.routes';
import { adminRoutes } from './features/(users)/admin/routes/admin.routes';
import { affiliateRoutes } from './features/(users)/affiliate/routes/affiliate.routes.ts';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: authRoutes,
  },
  {
    path: 'client',
    resolve: { session: sessionResolver },
    canActivate: [protectedGuard],
    component: DashboardLayout,
    children: clientRoutes,
  },
  {
    path: 'onboarding',
    component: AuthLayout,
    children: onboardingRoutes,
  },

  {
    path: 'admin',
    resolve: { session: sessionResolver },
    canActivate: [protectedGuard],
    component: DashboardLayout,
    children: adminRoutes,
  },

  {
    path: 'affiliate',
    resolve: { session: sessionResolver },
    canActivate: [protectedGuard],
    component: DashboardLayout,
    children: affiliateRoutes,
  },
];
