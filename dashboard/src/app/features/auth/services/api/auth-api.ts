import { User } from '../../../../shared/types/user.model';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, TokenResponse } from '../../../../shared/types/auth-model';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest) {
    return this.http.post<TokenResponse>(`${this.baseUrl}/auth/token/`, payload);
  }

  logout() {
    return this.http.post(`${this.baseUrl}/auth/token/logout/`, {});
  }

  refreshAccessToken() {
    return this.http.post<TokenResponse>(`${this.baseUrl}/auth/token/refresh/`, {});
  }

  me() {
    return this.http.get<User>(`${this.baseUrl}/users/me/`);
  }

  // PATCH
  updateMe(payload: any) {
    return this.http.patch<User>(`${this.baseUrl}/users/me/`, payload);
  }

  confirmEmail(code: string) {
    console.log('code no auth api:', code);
    return this.http.post<{ code: string }>(`${this.baseUrl}/auth/email/confirm/`, {
      code: code,
    });
  }

  registerClient(credentials: User) {
    return this.http.post<User>(`${this.baseUrl}/users/register_client/`, credentials);
  }
}
