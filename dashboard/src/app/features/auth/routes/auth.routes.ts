import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full',
  },

  {
    path: 'signin',
    title: 'Login – Rencard',
    loadComponent: () => import('../pages/signin/signin').then((m) => m.Signin),
  },

  {
    path: 'signup',
    title: 'Cadastro – Rencard',
    loadComponent: () => import('../pages/signup/signup').then((m) => m.Signup),

    children: [
      {
        path: '',
        redirectTo: 'address',
        pathMatch: 'full',
      },

      {
        path: 'personal-data',
        title: 'Dados Pessoais – Rencard',
        loadComponent: () =>
          import('../pages/signup/step/personal-data/personal-data').then((m) => m.PersonalData),
      },

      {
        path: 'address',
        title: 'Endereço – Rencard',
        loadComponent: () => import('../pages/signup/step/address/address').then((m) => m.Address),
      },

      {
        path: 'confirm',
        title: 'Confirmar cadastro – Rencard',
        loadComponent: () => import('../pages/signup/step/confirm/confirm').then((m) => m.Confirm),
      },
    ],
  },

  {
    path: 'confirm-email',
    title: 'Confirmação de E-mail – Rencard',
    loadComponent: () => import('../pages/confirm-email/confirm-email').then((m) => m.ConfirmEmail),
  },

  {
    path: 'change-email',
    title: 'Alterar E-mail – Rencard',
    loadComponent: () => import('../pages/change-email/change-email').then((m) => m.ChangeEmail),
  },

  {
    path: 'forgot-password',
    title: 'Esqueci minha senha – Rencard',
    loadComponent: () =>
      import('../pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },

  {
    path: 'reset-password',
    title: 'Redefinir senha – Rencard',
    loadComponent: () =>
      import('../pages/reset-password/reset-password').then((m) => m.ResetPassword),
  },

  {
    path: '**',
    redirectTo: 'signin',
  },
];
