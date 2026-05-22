import { UserRegistration } from '../../../../shared/types/user.model';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../../../../shared/types/auth-model';
import { AuthApi } from '../api/auth-api';
import { map, switchMap, tap } from 'rxjs';
import { AuthState } from '../state/auth/auth-state';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(
    private readonly api: AuthApi,
    private readonly state: AuthState,
  ) {}

  login(payload: LoginRequest) {
    return this.api.login(payload).pipe(
      tap(({ access }) => this.state.setAccessToken(access)),
      switchMap(() => this.api.me()),
      tap((user) => {
        this.state.setUser(user);
        console.log(user);
      }),
      map(() => true),
    );
  }

  register(credentials: UserRegistration) {
    return this.api.registerClient(credentials).pipe(
      tap((user) => console.log('[Auth] registro realizado com sucesso:', user)),
      // depois do registro, fazer login
      switchMap(() =>
        this.api.login({ email: credentials.email, password: credentials.password }).pipe(
          tap(({ access }) => this.state.setAccessToken(access)),
          switchMap(() => this.api.me()),
          tap((user) => this.state.setUser(user)),
          map(() => true),
        ),
      ),
    );
  }

  confirmEmail(code: string) {
    console.log('code facade', code);
    return this.api.confirmEmail(code).pipe(
      tap((teste) => {
        console.log(teste);
        console.log('[Auth] email confirmado com sucesso');
      }),
    );
  }

  refreshAccessToken() {
    return this.api
      .refreshAccessToken()
      .pipe(tap(({ access }) => this.state.setAccessToken(access)));
  }

  logout() {
    return this.api.logout().pipe(
      tap(() => {
        console.log('[Auth] logout realizado');
        this.state.clear(); // ✅ Limpa o estado após logout
      }),
    );
  }

  loadUser() {
    return this.api.me().pipe(
      tap((user) => {
        this.state.setUser(user);
      }),
    );
  }

  updateUser(payload: Partial<UserRegistration>) {
    return this.api.updateMe(payload).pipe(
      tap((user) => {
        console.log('[Auth] usuário atualizado:', user);
        this.state.setUser(user); // atualiza o estado com os novos dados
      }),
    );
  }
}
