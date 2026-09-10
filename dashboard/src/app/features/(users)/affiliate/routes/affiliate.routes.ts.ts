import { Routes } from '@angular/router';

export const affiliateRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: 'dashboard',
    title: 'Dashboard – Rencard',
    loadComponent: () => import('../pages/dashboard/dashboard').then((m) => m.Dashboard),
  },

  {
    path: 'payment',
    title: 'Dados de Pagamento – Rencard',
    loadComponent: () => import('../pages/payment/payment').then((m) => m.Payment),
  },

  {
    path: 'sales',
    title: 'Minhas vendas – Rencard',
    loadComponent: () => import('../pages/sales/sales').then((m) => m.Sales),
  },

  {
    path: 'coupons',
    title: 'Cupons – Rencard',
    loadComponent: () => import('../pages/coupons/coupons').then((m) => m.Coupons),
  },

  {
    path: 'settings',
    title: 'Configurações – Rencard',
    loadComponent: () => import('../pages/settings/settings').then((m) => m.Settings),
  },

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
