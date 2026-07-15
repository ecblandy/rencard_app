import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthState } from '../../features/auth/services/state/auth/auth-state';
import { AuthApi } from '../../features/auth/services/api/auth-api';

// 🌍 APIs públicas externas
const PUBLIC_EXTERNAL_DOMAINS = ['viacep.com.br'];

// 🔓 Endpoints públicos da API
const PUBLIC_API_ENDPOINTS = ['/auth/email/confirm'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthState);
  const authApi = inject(AuthApi);

  /* -------------------------------------------------------------------------- */
  /* 🧩 Helpers                                                                  */
  /* -------------------------------------------------------------------------- */

  const cloneWithToken = (token: string) =>
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
      withCredentials: true,
    });

  /**
   * Requisição sem autenticação
   * Só envia cookies se existir sessão ativa.
   */
  const sendWithoutToken = () => {
    const hasSession = authState.isAuthenticated();

    return next(
      req.clone({
        withCredentials: hasSession,
      }),
    );
  };

  const tryRefreshAndRetry = () =>
    authApi.refreshAccessToken().pipe(
      switchMap(({ access }) => {
        authState.setAccessToken(access);

        return next(cloneWithToken(access));
      }),
      catchError((err) => {
        authState.clear();

        return throwError(() => err);
      }),
    );

  /* -------------------------------------------------------------------------- */
  /* 🌍 APIs públicas externas                                                    */
  /* -------------------------------------------------------------------------- */

  if (PUBLIC_EXTERNAL_DOMAINS.some((domain) => req.url.includes(domain))) {
    return next(req);
  }

  /* -------------------------------------------------------------------------- */
  /* 🔓 Endpoints públicos                                                       */
  /* -------------------------------------------------------------------------- */

  const isPublicApiEndpoint = PUBLIC_API_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

  if (isPublicApiEndpoint) {
    return sendWithoutToken();
  }

  /* -------------------------------------------------------------------------- */
  /* 🔒 Rotas privadas                                                           */
  /* -------------------------------------------------------------------------- */

  const token = authState.accessToken();
  const isExpired = authState.isAccessTokenExpired();

  /**
   * Usuário nunca autenticou:
   * não manda token
   * não tenta refresh
   */
  if (!token) {
    return sendWithoutToken();
  }

  /**
   * Usuário tem sessão mas access expirou:
   * tenta renovar
   */
  if (isExpired) {
    return tryRefreshAndRetry();
  }

  /**
   * Usuário autenticado normalmente:
   * manda access token + refresh cookie
   */
  return next(cloneWithToken(token)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      return tryRefreshAndRetry();
    }),
  );
};
