import { User } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access: string;
}

export interface AuthStateModel {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  accessTokenExpiresAt: number | null;
}
