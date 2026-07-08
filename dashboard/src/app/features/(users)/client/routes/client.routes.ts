import { Routes } from '@angular/router';

export const clientRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [],
    loadComponent: () => import('../pages/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard – Rencard',
  },
  {
    path: 'billing',
    children: [
      {
        path: '',
        redirectTo: 'preview',
        pathMatch: 'full',
      },
      {
        path: 'preview',
        loadComponent: () => import('../pages/billing/preview/preview').then((m) => m.Preview),
        title: 'Prévia da Assinatura – Rencard',
      },
      {
        path: 'change-plan',
        loadComponent: () =>
          import('../pages/billing/change-plan/change-plan').then((m) => m.ChangePlan),
        title: 'Escolher Plano – Rencard',
      },
    ],
  },

  {
    path: 'profile',
    canActivate: [],
    loadComponent: () => import('../pages/profile/profile').then((m) => m.Profile),
    title: 'Assinatura – Rencard',
  },
  {
    path: 'apps',
    canActivate: [],
    loadComponent: () => import('../pages/apps/apps').then((m) => m.Apps),
    title: 'Códigos e Apps – Rencard',
  },
  {
    path: 'settings',
    canActivate: [],
    loadComponent: () => import('../pages/settings/settings').then((m) => m.Settings),
    title: 'Configurações – Rencard',
  },

  {
    path: 'support',
    canActivate: [],
    loadComponent: () => import('../pages/support/support').then((m) => m.Support),
    title: 'Suporte – Rencard',
  },
  { path: '**', redirectTo: 'dashboard' },
];
