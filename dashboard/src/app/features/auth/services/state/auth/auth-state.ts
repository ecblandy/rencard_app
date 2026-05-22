import { computed, Injectable, signal } from '@angular/core';
import { User } from '../../../../../shared/types/user.model';
import { AuthStateModel } from '../../../../../shared/types/auth-model';
import { decodeJwt } from '../../../../../shared/utils/jwt.util';

@Injectable({ providedIn: 'root' })
export class AuthState {
  private readonly _state = signal<AuthStateModel>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    accessTokenExpiresAt: null,
  });

  readonly user = computed(() => this._state().user);
  readonly accessToken = computed(() => this._state().accessToken);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);

  readonly isAccessTokenExpired = computed(() => {
    const expiresAt = this._state().accessTokenExpiresAt;
    return !expiresAt || Date.now() >= expiresAt;
  });

  setAccessToken(token: string) {
    const { exp } = decodeJwt(token);

    this._state.update((s) => ({
      ...s,
      accessToken: token,
      isAuthenticated: true,
      accessTokenExpiresAt: exp ? exp * 1000 : null,
    }));
  }

  setUser(user: User) {
    this._state.update((s) => ({
      ...s,
      user,
    }));
  }

  clear() {
    this._state.set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      accessTokenExpiresAt: null,
    });
  }
}
