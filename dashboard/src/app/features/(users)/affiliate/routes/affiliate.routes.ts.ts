// affiliate.routes.ts
import { Routes } from '@angular/router';

export const affiliateRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('../pages/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard – Rencard',
  },
  {
    path: 'payment',
    loadComponent: () => import('../pages/payment/payment').then((m) => m.Payment),
    title: 'Dados de Pagamento – Rencard',
  },
  {
    path: 'sales',
    loadComponent: () => import('../pages/sales/sales').then((m) => m.Sales),
    title: 'Minhas vendas – Rencard',
  },
  {
    path: 'coupons',
    loadComponent: () => import('../pages/coupons/coupons').then((m) => m.Coupons),
    title: 'Cupons – Rencard',
  },
  {
    path: 'settings',
    loadComponent: () => import('../pages/settings/settings').then((m) => m.Settings),
    title: 'Configurações – Rencard',
  },
  { path: '**', redirectTo: 'dashboard' },
];
