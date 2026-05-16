import { api, tokenStorage } from './client';

// ────────────────────────────────────────────
// Types (Backend modelleriyle eşleşir)
// ────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  full_name: string;
  company_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface UserResponse {
  id: number;
  full_name: string;
  company_name: string;
  email: string;
}

// ────────────────────────────────────────────
// Auth API fonksiyonları
// ────────────────────────────────────────────

/**
 * Kullanıcı girişi. Başarılı olursa token'ı storage'a kaydeder.
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', data);
  tokenStorage.set(response.access_token);
  return response;
}

/**
 * Yeni kullanıcı kaydı. Başarılı olursa UserResponse döner.
 */
export async function register(data: RegisterRequest): Promise<UserResponse> {
  return api.post<UserResponse>('/auth/register', data);
}

/**
 * JWT token'dan kullanıcı bilgisini decode eder (client-side).
 * Backend'de /me endpoint'i yoksa bu fonksiyon kullanılır.
 */
export function decodeUserFromToken(token: string): Partial<UserResponse> | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    // Backend token payload: { sub: email, exp: ... }
    return { email: decoded.sub };
  } catch {
    return null;
  }
}

/**
 * Oturumu sonlandırır — token'ı temizler.
 */
export function logout(): void {
  tokenStorage.clear();
}
