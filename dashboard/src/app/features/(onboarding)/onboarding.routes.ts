import { Routes } from '@angular/router';

export const onboardingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./onboarding').then((m) => m.Onboarding),
    title: 'Onboarding – Rencard',
    children: [
      {
        path: '',
        redirectTo: 'style',
        pathMatch: 'full',
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products').then((m) => m.Products),
        title: 'Produtos – Rencard',
        data: { step: 1 },
      },
      {
        path: 'terms',
        loadComponent: () => import('./pages/terms/terms').then((m) => m.Terms),
        title: 'Termos de compra – Rencard',
        data: { step: 2 },
      },
      {
        path: 'checkout',
        loadComponent: () => import('./pages/checkout/checkout').then((m) => m.Checkout),
        title: 'Checkout – Rencard',
        data: { step: 3 },
      },
      {
        path: 'checkout/success',
        loadComponent: () => import('./pages/checkout/success/success').then((m) => m.Success),
        title: 'Pagamento aprovado – Rencard',
      },
      {
        path: 'checkout/erro',
        loadComponent: () => import('./pages/checkout/erro/erro').then((m) => m.Erro),
        title: 'Erro no pagamento – Rencard',
      },
    ],
  },
];
