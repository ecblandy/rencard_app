import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthState } from '../../features/auth/services/state/auth/auth-state';
import { AuthApi } from '../../features/auth/services/api/auth-api';

// 🌍 APIs públicas externas
const PUBLIC_EXTERNAL_DOMAINS = ['viacep.com.br'];

// 🔓 Auth
const AUTH_BASE = '/auth/';
const AUTH_CONFIRM_EMAIL = '/auth/email/confirm';

// 🔓 Outras rotas públicas
const PUBLIC_ROUTES = ['/users/register_client/'];

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

  const sendWithoutToken = () => next(req.clone({ withCredentials: true }));

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
  if (PUBLIC_EXTERNAL_DOMAINS.some((d) => req.url.includes(d))) {
    return next(req);
  }

  const isAuthRoute = req.url.includes(AUTH_BASE);
  const isConfirmEmail = req.url.includes(AUTH_CONFIRM_EMAIL);
  const isPublicRoute = PUBLIC_ROUTES.some((r) => req.url.includes(r));

  /* -------------------------------------------------------------------------- */
  /* 🔓 Públicas + /auth/* (exceto confirm-email)                                */
  /* -------------------------------------------------------------------------- */
  if ((isAuthRoute && !isConfirmEmail) || isPublicRoute) {
    return sendWithoutToken();
  }

  /* -------------------------------------------------------------------------- */
  /* 🟡 /auth/email/confirm                                                      */
  /* -------------------------------------------------------------------------- */
  if (isConfirmEmail) {
    const token = authState.accessToken();

    if (token) {
      return next(cloneWithToken(token));
    }

    // tenta refresh, se falhar segue sem token
    return authApi.refreshAccessToken().pipe(
      switchMap(({ access }) => {
        authState.setAccessToken(access);
        return next(cloneWithToken(access));
      }),
      catchError(() => sendWithoutToken()),
    );
  }

  /* -------------------------------------------------------------------------- */
  /* 🔒 Rotas privadas                                                           */
  /* -------------------------------------------------------------------------- */
  const token = authState.accessToken();
  const isExpired = authState.isAccessTokenExpired();

  if (!token || isExpired) {
    return tryRefreshAndRetry();
  }

  return next(cloneWithToken(token)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      return tryRefreshAndRetry();
    }),
  );
};
