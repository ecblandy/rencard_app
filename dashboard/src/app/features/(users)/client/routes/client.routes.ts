import { DeliveryInformation } from './../pages/delivery-information/delivery-information';
import { Routes } from '@angular/router';
import { pendingSubscriptionGuard } from '../pages/guard/pending-subscription-guard';

export const clientRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('../pages/dashboard/dashboard').then((m) => m.Dashboard),
  },

  {
    path: 'profile',
    loadComponent: () => import('../pages/profile/profile').then((m) => m.Profile),
  },

  {
    path: 'apps',
    loadComponent: () => import('../pages/apps/apps').then((m) => m.Apps),
  },

  {
    path: 'settings',
    loadComponent: () => import('../pages/settings/settings').then((m) => m.Support),
  },

  {
    path: 'support',
    loadComponent: () => import('../pages/support/support').then((m) => m.Support),
  },
  {
    path: 'delivery-information',
    loadComponent: () =>
      import('../pages/delivery-information/delivery-information').then(
        (m) => m.DeliveryInformation,
      ),
  },
  {
    path: 'billing',
    children: [
      {
        path: 'preview',
        loadComponent: () => import('../pages/billing/preview/preview').then((m) => m.Preview),
      },

      {
        path: 'change-plan',
        canActivate: [pendingSubscriptionGuard],
        loadComponent: () =>
          import('../pages/billing/change-plan/change-plan').then((m) => m.ChangePlan),
      },

      {
        path: 'checkout',
        canActivate: [pendingSubscriptionGuard],
        loadComponent: () => import('../pages/billing/checkout/checkout').then((m) => m.Checkout),
      },
    ],
  },
];
