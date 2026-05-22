import { Routes } from '@angular/router';
import { postAuthGuard } from '../guard/post-auth-guard';

export const authRoutes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  {
    path: 'signin',
    loadComponent: () => import('../pages/signin/signin').then((m) => m.Signin),
    title: 'Login – Rencard',
  },
  {
    path: 'signup',
    loadComponent: () => import('../pages/signup/signup').then((m) => m.Signup),
    title: 'Cadastro – Rencard',
    children: [
      {
        path: '',
        redirectTo: 'address',
        pathMatch: 'full',
      },
      {
        path: 'personal-data',
        loadComponent: () =>
          import('../pages/signup/step/personal-data/personal-data').then((m) => m.PersonalData),
        title: 'Dados Pessoais – Rencard',
      },

      {
        path: 'address',
        loadComponent: () => import('../pages/signup/step/address/address').then((m) => m.Address),
        title: 'Endereço – Rencard',
      },

      {
        path: 'plan',
        loadComponent: () => import('../pages/signup/step/plan/plan').then((m) => m.Plan),
        title: 'Planos – Rencard',
      },

      {
        path: 'product',
        loadComponent: () => import('../pages/signup/step/product/product').then((m) => m.Product),
        title: 'Produto – Rencard',
      },

      {
        path: 'confirm',
        loadComponent: () => import('../pages/signup/step/confirm/confirm').then((m) => m.Confirm),
        title: 'Confirmar cadastro – Rencard',
      },
    ],
  },
  {
    path: 'confirm-email',
    loadComponent: () => import('../pages/confirm-email/confirm-email').then((m) => m.ConfirmEmail),
    title: 'Confirmação de E-mail – Rencard',
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('../pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
    title: 'Esqueci minha senha – Rencard',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('../pages/reset-password/reset-password').then((m) => m.ResetPassword),
    title: 'Redefinir senha – Rencard',
  },
  { path: '**', redirectTo: 'signin' },
];
