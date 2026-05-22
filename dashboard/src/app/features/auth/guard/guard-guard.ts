import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../services/state/auth/auth-state';
import { AuthApi } from '../services/api/auth-api';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthState);
  const authApi = inject(AuthApi);
  const router = inject(Router);

  // Já autenticado
  if (authState.isAuthenticated()) {
    return true;
  }

  // Tenta refresh silencioso
  return authApi.refreshAccessToken().pipe(
    map(({ access }) => {
      authState.setAccessToken(access);
      return true;
    }),
    catchError(() => {
      authState.clear();
      router.navigate(['/auth/signin']);
      return of(false);
    }),
  );
};
