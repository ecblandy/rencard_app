import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthApi } from '../services/api/auth-api';
import { AuthState } from '../services/state/auth/auth-state';

@Injectable({ providedIn: 'root' })
export class SessionInitializer {
  private initialized = false;

  constructor(
    private readonly authApi: AuthApi,
    private readonly authState: AuthState,
  ) {}

  init(): Observable<void> {
    console.log('[SessionInitializer] init chamado');

    if (this.initialized) {
      console.log('[SessionInitializer] já inicializado, ignorando');
      return of(void 0);
    }

    this.initialized = true;
    console.log('[SessionInitializer] tentando refresh do access token');

    return this.authApi.refreshAccessToken().pipe(
      tap(({ access }) => {
        console.log('[SessionInitializer] refresh OK, token recebido');
        this.authState.setAccessToken(access);
      }),

      map(() => {
        console.log('[SessionInitializer] estado de auth restaurado');
        return void 0;
      }),

      catchError((err) => {
        console.warn('[SessionInitializer] refresh falhou, limpando estado', err);
        this.authState.clear();
        return of(void 0);
      }),
    );
  }
}
