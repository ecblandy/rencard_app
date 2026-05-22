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
    loadComponent: () => import('../pages/billing/billing').then((m) => m.Billing),
    title: 'Assinatura – Rencard',
    children: [
      {
        path: 'change-plan',
        loadComponent: () =>
          import('../pages/billing/change-plan/change-plan').then((m) => m.ChangePlan),
        title: 'Alterar Plano – Rencard',
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
  { path: '**', redirectTo: 'dashboard' },
];
