import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
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
    path: 'users-and-subscriptions',
    title: 'Usuários e Assinaturas – Rencard',
    loadComponent: () =>
      import('../pages/users-and-subscription/users-and-subscription').then(
        (m) => m.UsersAndSubscription,
      ),
  },

  {
    path: 'integrations',
    title: 'Integrações – Rencard',
    loadComponent: () => import('../pages/integrations/integrations').then((m) => m.Integrations),
  },

  {
    path: 'settings',
    title: 'Configurações – Rencard',
    loadComponent: () => import('../pages/settings/settings').then((m) => m.Settings),
  },

  {
    path: 'coupons',
    title: 'Cupons – Rencard',
    loadComponent: () => import('../pages/coupons/coupons').then((m) => m.Coupons),
  },

  {
    path: 'coupons/:id',
    title: 'Detalhes do Cupom – Rencard',
    loadComponent: () =>
      import('../pages/coupons/coupon-details/coupon-details').then((m) => m.CouponDetails),
  },

  {
    path: 'partners',
    title: 'Parceiros – Rencard',
    loadComponent: () => import('../pages/partners/partners').then((m) => m.Partners),
  },

  {
    path: 'partners/:id',
    title: 'Detalhes do Parceiro – Rencard',
    loadComponent: () =>
      import('../pages/partners/partners-details/partner-details').then((m) => m.PartnerDetails),
  },

  {
    path: 'physical',
    title: 'Cartões Físicos – Rencard',
    loadComponent: () => import('../pages/physical/physical').then((m) => m.Physical),
  },

  {
    path: 'physical/:id',
    title: 'Detalhes do Cartão – Rencard',
    loadComponent: () =>
      import('../pages/physical/physical-details/physical-details').then((m) => m.PhysicalDetails),
  },

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
