import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthState } from '../../features/auth/services/state/auth/auth-state';
import { AuthApi } from '../../features/auth/services/api/auth-api';

// 🌍 APIs públicas externas
const PUBLIC_EXTERNAL_DOMAINS = ['viacep.com.br'];

// 🔓 Endpoints públicos da API (não exigem token, nem cookie)
const PUBLIC_API_ENDPOINTS = ['/auth/email/confirm'];

// 🍪 Endpoints que SEMPRE precisam mandar/receber o cookie de refresh,
// mesmo sem access token em memória.
// '/auth/token/' cobre login (/auth/token/), refresh (/auth/token/refresh/)
// e logout (/auth/token/logout/), já que usamos .includes()
const ALWAYS_CREDENTIALS_ENDPOINTS = ['/auth/token/'];

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
   * Requisição sem access token.
   * Manda cookie (withCredentials) se:
   *  - já existe sessão ativa em memória, OU
   *  - é um endpoint que precisa do cookie mesmo sem sessão (login/refresh/logout)
   */
  const sendWithoutToken = () => {
    const alwaysCredentials = ALWAYS_CREDENTIALS_ENDPOINTS.some((endpoint) =>
      req.url.includes(endpoint),
    );
    const hasSession = authState.isAuthenticated();

    return next(
      req.clone({
        withCredentials: alwaysCredentials || hasSession,
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
   * Usuário nunca autenticou (ou fez logout):
   * não manda Authorization, mas ainda pode precisar mandar cookie
   * (ex.: chamada de /auth/token/ ou /auth/token/refresh/)
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
