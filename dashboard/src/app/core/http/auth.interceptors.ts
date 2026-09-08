import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { catchError, switchMap, throwError } from 'rxjs';

import { inject } from '@angular/core';

import { AuthState } from '../../features/auth/services/state/auth/auth-state';
import { AuthApi } from '../../features/auth/services/api/auth-api';

/**
 * APIs públicas externas.
 */
const PUBLIC_EXTERNAL_DOMAINS = ['viacep.com.br'];

/**
 * Endpoints que podem ser chamados tanto por:
 *
 * - usuário autenticado
 * - usuário não autenticado
 *
 * Se houver access token válido, ele será enviado.
 */
const PUBLIC_API_ENDPOINTS = ['/auth/email/confirm/'];

/**
 * Endpoints que sempre precisam enviar cookies.
 */
const ALWAYS_CREDENTIALS_ENDPOINTS = ['/auth/token/'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthState);
  const authApi = inject(AuthApi);

  /* -------------------------------------------------------------------------- */
  /* Helpers                                                                    */
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
   *
   * Envia cookie quando:
   *
   * - é endpoint que sempre precisa de credentials
   * - existe sessão ativa
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

  /**
   * Endpoint público que também aceita autenticação.
   *
   * Exemplos:
   *
   * /auth/email/confirm/
   *
   * Se houver token:
   *   Authorization: Bearer ...
   *
   * Se não houver:
   *   requisição normal.
   */
  const sendPublicButAuthIfAvailable = () => {
    const token = authState.accessToken();

    /**
     * Token válido.
     */
    if (token && !authState.isAccessTokenExpired()) {
      return next(cloneWithToken(token));
    }

    /**
     * Token expirado.
     *
     * Tentamos renovar.
     */
    if (token && authState.isAccessTokenExpired()) {
      return authApi.refreshAccessToken().pipe(
        switchMap(({ access }) => {
          authState.setAccessToken(access);

          return next(cloneWithToken(access));
        }),

        catchError(() => {
          authState.clear();

          return next(
            req.clone({
              withCredentials: true,
            }),
          );
        }),
      );
    }

    /**
     * Sem token.
     */
    return next(
      req.clone({
        withCredentials: true,
      }),
    );
  };

  /**
   * Tenta renovar o access token e repete
   * a requisição original.
   */
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
  /* APIs públicas externas                                                     */
  /* -------------------------------------------------------------------------- */

  if (PUBLIC_EXTERNAL_DOMAINS.some((domain) => req.url.includes(domain))) {
    return next(req);
  }

  /* -------------------------------------------------------------------------- */
  /* Endpoints públicos que também aceitam autenticação                         */
  /* -------------------------------------------------------------------------- */

  const isPublicApiEndpoint = PUBLIC_API_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

  if (isPublicApiEndpoint) {
    return sendPublicButAuthIfAvailable();
  }

  /* -------------------------------------------------------------------------- */
  /* Rotas privadas                                                             */
  /* -------------------------------------------------------------------------- */

  const token = authState.accessToken();

  const isExpired = authState.isAccessTokenExpired();

  /**
   * Sem access token.
   */
  if (!token) {
    return sendWithoutToken();
  }

  /**
   * Access token expirado.
   */
  if (isExpired) {
    return tryRefreshAndRetry();
  }

  /**
   * Access token válido.
   */
  return next(cloneWithToken(token)).pipe(
    catchError((error: HttpErrorResponse) => {
      /**
       * Só tenta refresh novamente
       * quando recebeu 401.
       */
      if (error.status !== 401) {
        return throwError(() => error);
      }

      return tryRefreshAndRetry();
    }),
  );
};
