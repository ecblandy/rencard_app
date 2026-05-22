import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../services/state/auth/auth-state';

export const postAuthGuard: CanActivateFn = () => {
  const authState = inject(AuthState);
  const router = inject(Router);

  const user = authState.user();

  // Usuário não logado → mandar para login
  if (!user) {
    router.navigate(['/auth/signin']);
    return false;
  }

  // Email não confirmado → mandar para confirmar email
  if (!user.active_access_grant) {
    router.navigate(['/auth/confirm-email']);
    return false;
  }

  // Email confirmado → redirecionar pro dashboard certo
  switch (user.role) {
    case 'admin':
      router.navigate(['/admin/dashboard']);
      break;
    case 'affiliate':
      router.navigate(['/affiliate/dashboard']);
      break;
    case 'client':
      router.navigate(['/client/dashboard']);
      break;
    default:
      router.navigate(['/auth/signin']); // fallback
      break;
  }

  // Retorna falso porque já redirecionou
  return false;
};
