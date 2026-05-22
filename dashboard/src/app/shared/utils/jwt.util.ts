export interface DecodedJwt {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

export function decodeJwt(token: string): DecodedJwt {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}
