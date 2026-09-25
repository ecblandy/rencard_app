import { Routes } from '@angular/router';

import { pendingSubscriptionGuard } from '../pages/guard/pending-subscription-guard';

export const clientRoutes: Routes = [
  {
    path: 'dashboard',
    title: 'Dashboard – Rencard',
    loadComponent: () => import('../pages/dashboard/dashboard').then((m) => m.Dashboard),
  },

  {
    path: 'profile',
    title: 'Meu perfil – Rencard',
    loadComponent: () => import('../pages/profile/profile').then((m) => m.Profile),
  },

  {
    path: 'apps',
    title: 'Aplicativos – Rencard',
    loadComponent: () => import('../pages/apps/apps').then((m) => m.Apps),
  },

  {
    path: 'settings',
    title: 'Configurações – Rencard',
    loadComponent: () => import('../pages/settings/settings').then((m) => m.Support),
  },

  {
    path: 'support',
    title: 'Suporte – Rencard',
    loadComponent: () => import('../pages/support/support').then((m) => m.Support),
  },

  {
    path: 'delivery-information',
    title: 'Informações de entrega – Rencard',
    loadComponent: () =>
      import('../pages/delivery-information/delivery-information').then(
        (m) => m.DeliveryInformation,
      ),
  },

  // =========================================================
  // PAGAMENTO DE ONBOARDING PENDENTE
  // Sem canActivate próprio aqui: quem decide mandar o usuário pra cá é o
  // protectedGuard (aplicado no nível pai das rotas de client). Essa rota
  // só precisa existir para ele ter pra onde redirecionar.
  // =========================================================

  {
    path: 'onboarding/pending-payment',
    title: 'Pagamento pendente – Rencard',
    loadComponent: () =>
      import('../pages/onboarding-pending-payment/onboarding-pending-payment').then(
        (m) => m.OnboardingPendingPayment,
      ),
  },

  {
    path: 'billing',
    children: [
      {
        path: 'preview',
        title: 'Minha assinatura – Rencard',
        loadComponent: () => import('../pages/billing/preview/preview').then((m) => m.Preview),
      },

      {
        path: 'change-plan',
        title: 'Alterar plano – Rencard',
        canActivate: [pendingSubscriptionGuard],
        loadComponent: () =>
          import('../pages/billing/change-plan/change-plan').then((m) => m.ChangePlan),
      },

      {
        path: 'checkout',
        title: 'Checkout – Rencard',
        canActivate: [pendingSubscriptionGuard],
        loadComponent: () => import('../pages/billing/checkout/checkout').then((m) => m.Checkout),
      },
    ],
  },
];
