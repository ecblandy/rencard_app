import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../../services/state/auth/auth-state';
import { AuthApi } from '../../services/api/auth-api';
import { catchError, map, of, switchMap } from 'rxjs';

export const protectedGuard: CanActivateFn = (route, state) => {
  const authState = inject(AuthState);
  const authApi = inject(AuthApi);
  const router = inject(Router);

  const redirectToLogin = () => {
    router.navigate(['/auth/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  };

  const redirectToConfirmEmail = () => {
    router.navigate(['/auth/confirm-email']);
    return false;
  };

  const checkRoleAccess = (userRole: string, requiredRoles?: string[]) => {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!requiredRoles.includes(userRole)) {
      redirectBasedOnRole(userRole, router);
      return false;
    }

    return true;
  };

  // ✅ Se está autenticado em memória, só valida
  if (authState.isAuthenticated() && !authState.isAccessTokenExpired()) {
    const user = authState.user();

    if (!user) {
      authState.clear();
      return redirectToLogin();
    }

    // if (!user.active_access_grant) {
    //   return redirectToConfirmEmail();
    // }

    const allowedRoles = route.data?.['roles'] as string[] | undefined;
    return checkRoleAccess(user.role, allowedRoles);
  }

  // ✅ Se não está autenticado em memória, tenta refresh (página foi recarregada)
  console.log('[Guard] Tentando recuperar sessão via refresh token...');

  return authApi.refreshAccessToken().pipe(
    switchMap(({ access }) => {
      console.log('[Guard] Refresh bem-sucedido, buscando dados do usuário...');
      authState.setAccessToken(access);
      return authApi.me();
    }),
    map((user) => {
      console.log('[Guard] Usuário recuperado:', user);
      authState.setUser(user);

      // if (!user.active_access_grant) {
      //   redirectToConfirmEmail();
      //   return false;
      // }

      const allowedRoles = route.data?.['roles'] as string[] | undefined;
      return checkRoleAccess(user.role, allowedRoles);
    }),
    catchError((error) => {
      console.error('[Guard] Falha ao recuperar sessão:', error);
      authState.clear();
      redirectToLogin();
      return of(false);
    }),
  );
};

function redirectBasedOnRole(role: string, router: Router) {
  const roleRoutes: Record<string, string> = {
    admin: '/admin/dashboard',
    manager: '/manager/dashboard',
    client: '/client/dashboard',
  };

  const targetRoute = roleRoutes[role] || '/';
  router.navigate([targetRoute]);
}
