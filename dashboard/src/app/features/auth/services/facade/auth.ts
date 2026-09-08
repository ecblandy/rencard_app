import { Injectable } from '@angular/core';
import { map, switchMap, tap } from 'rxjs';

import { UserRegistration } from '../../../../shared/types/user.model';
import { LoginRequest } from '../../../../shared/types/auth-model';

import { AuthApi } from '../api/auth-api';
import { AuthState } from '../state/auth/auth-state';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(
    private readonly api: AuthApi,
    private readonly state: AuthState,
  ) {}

  // =========================================================
  // LOGIN
  // =========================================================

  login(payload: LoginRequest) {
    return this.api.login(payload).pipe(
      tap(({ access }) => {
        this.state.setAccessToken(access);
      }),

      switchMap(() => this.api.me()),

      tap((user) => {
        this.state.setUser(user);
      }),

      map(() => true),
    );
  }

  // =========================================================
  // REGISTRO
  // =========================================================

  register(credentials: UserRegistration) {
    return this.api.registerClient(credentials).pipe(
      tap((user) => {
        console.log('[Auth] registro realizado com sucesso:', user);
      }),

      switchMap(() =>
        this.api
          .login({
            email: credentials.email,
            password: credentials.password,
          })
          .pipe(
            tap(({ access }) => {
              this.state.setAccessToken(access);
            }),

            switchMap(() => this.api.me()),

            tap((user) => {
              this.state.setUser(user);
            }),

            map(() => true),
          ),
      ),
    );
  }

  // =========================================================
  // CONFIRMAÇÃO DE EMAIL
  // =========================================================

  confirmEmail(code: string, email?: string) {
    return this.api.confirmEmail(code, email).pipe(
      tap(() => {
        console.log('[Auth] email confirmado com sucesso');
      }),
    );
  }

  // =========================================================
  // ALTERAÇÃO DE EMAIL
  // =========================================================

  confirmChangeEmail(code: string) {
    return this.api.confirmChangeEmail(code).pipe(
      tap(() => {
        console.log('[Auth] troca de email confirmada com sucesso');
      }),
    );
  }

  resendConfirmationCode(email: string) {
    return this.api.resendConfirmationCode(email).pipe(
      tap(() => {
        console.log('[Auth] código de confirmação reenviado com sucesso');
      }),
    );
  }

  changeEmail(newEmail: string) {
    return this.api.changeEmail(newEmail).pipe(
      tap(() => {
        console.log('[Auth] email alterado com sucesso');
      }),
    );
  }

  // =========================================================
  // TOKEN
  // =========================================================

  refreshAccessToken() {
    return this.api.refreshAccessToken().pipe(
      tap(({ access }) => {
        this.state.setAccessToken(access);
      }),
    );
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  logout() {
    return this.api.logout().pipe(
      tap(() => {
        console.log('[Auth] logout realizado');

        this.state.clear();
      }),
    );
  }

  // =========================================================
  // CARREGAR USUÁRIO
  // =========================================================

  loadUser() {
    return this.api.me().pipe(
      tap((user) => {
        console.log('[Auth] usuário recarregado:', user);

        this.state.setUser(user);
      }),
    );
  }

  // =========================================================
  // ATUALIZAR USUÁRIO
  // =========================================================

  updateUser(payload: Partial<UserRegistration>) {
    return this.api.updateMe(payload).pipe(
      tap((user) => {
        console.log('[Auth] usuário atualizado:', user);

        this.state.setUser(user);
      }),
    );
  }

  /**
   * Troca a senha do usuário JÁ AUTENTICADO, exigindo a senha
   * atual. Usa o mesmo endpoint de atualização de perfil
   * (PATCH /users/me/), conforme documentado para clientes
   * e afiliados.
   */
  changePassword(currentPassword: string, newPassword: string) {
    return this.api
      .updateMe({
        current_password: currentPassword,
        password: newPassword,
      })
      .pipe(
        tap(() => {
          console.log('[Auth] senha alterada com sucesso');
        }),
      );
  }

  // =========================================================
  // RECUPERAÇÃO / REDEFINIÇÃO DE SENHA (usuário NÃO autenticado)
  // =========================================================

  /**
   * Dispara o e-mail com o link de "esqueci minha senha".
   * Usado quando o usuário não está logado.
   */
  requestPasswordReset(email: string) {
    return this.api.requestPasswordReset(email).pipe(
      tap(() => {
        console.log('[Auth] link de redefinição de senha enviado');
      }),
    );
  }

  /**
   * Confirma a nova senha a partir do uid/token
   * recebidos por e-mail (fluxo não autenticado).
   */
  confirmPasswordReset(uid: string, token: string, newPassword: string) {
    return this.api.confirmPasswordReset(uid, token, newPassword).pipe(
      tap(() => {
        console.log('[Auth] senha redefinida com sucesso');
      }),
    );
  }
}
