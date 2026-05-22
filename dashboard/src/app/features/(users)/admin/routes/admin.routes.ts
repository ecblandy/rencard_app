import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('../pages/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard – Rencard',
  },

  {
    path: 'users-and-subscriptions',
    loadComponent: () =>
      import('../pages/users-and-subscription/users-and-subscription').then(
        (m) => m.UsersAndSubscription,
      ),
    title: 'Usuários e Assinaturas – Rencard',
  },
  {
    path: 'integrations',
    loadComponent: () => import('../pages/integrations/integrations').then((m) => m.Integrations),
    title: 'Integrações – Rencard',
  },
  {
    path: 'settings',
    loadComponent: () => import('../pages/settings/settings').then((m) => m.Settings),
    title: 'Configurações – Rencard',
  },
  {
    path: 'coupons',
    loadComponent: () => import('../pages/coupons/coupons').then((m) => m.Coupons),
    title: 'Cupons – Rencard',
  },
  {
    path: 'coupons/:id',
    loadComponent: () =>
      import('../pages/coupons/coupon-details/coupon-details').then((m) => m.CouponDetails),
    title: 'Detalhes do Cupom – Rencard',
  },

  {
    path: 'partners',
    loadComponent: () => import('../pages/partners/partners').then((m) => m.Partners),
    title: 'Parceiros – Rencard',
  },

  {
    path: 'partners/:id',
    loadComponent: () =>
      import('../pages/partners/partners-details/partner-details').then((m) => m.PartnerDetails),
    title: 'Detalhes do Parceiro – Rencard',
  },

  {
    path: 'physical',
    loadComponent: () => import('../pages/physical/physical').then((m) => m.Physical),
    title: 'Cartões Físicos – Rencard',
  },
  {
    path: 'physical/:id',
    loadComponent: () =>
      import('../pages/physical/physical-details/physical-details').then((m) => m.PhysicalDetails),
    title: 'Detalhes do Cartão – Rencard',
  },
  { path: '**', redirectTo: 'dashboard' },
];
