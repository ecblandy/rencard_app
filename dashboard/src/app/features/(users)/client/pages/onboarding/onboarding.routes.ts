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
        path: 'style',
        loadComponent: () => import('./pages/style/style').then((m) => m.Style),
        title: 'Estilo – Rencard',
        data: { step: 1 },
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/product/product').then((m) => m.Product),
        title: 'Produtos – Rencard',
        data: { step: 2 },
      },
      {
        path: 'terms',
        loadComponent: () => import('./pages/terms/terms').then((m) => m.Terms),
        title: 'Termos de compra – Rencard',
        data: { step: 3 },
      },
      {
        path: 'checkout',
        loadComponent: () => import('./pages/checkout/checkout').then((m) => m.Checkout),
        title: 'Checkout – Rencard',
        data: { step: 4 },
      },
    ],
  },
];
