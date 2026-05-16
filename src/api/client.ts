const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// ────────────────────────────────────────────
// Custom API Error
// ────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ────────────────────────────────────────────
// Token helpers
// ────────────────────────────────────────────

const TOKEN_KEY = 'agence_access_token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

// ────────────────────────────────────────────
// Core fetch wrapper
// ────────────────────────────────────────────

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStorage.get();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Token geçersiz → oturumu temizle ve login'e yönlendir
  if (response.status === 401) {
    tokenStorage.clear();
    window.location.href = '/login';
    throw new ApiError(401, 'Oturum süresi doldu. Lütfen tekrar giriş yapın.');
  }

  if (!response.ok) {
    let detail: unknown;
    let message = `HTTP ${response.status}`;

    try {
      const errorBody = await response.json();
      // FastAPI detail formatı
      detail = errorBody.detail;
      if (typeof errorBody.detail === 'string') {
        message = errorBody.detail;
      } else if (Array.isArray(errorBody.detail)) {
        // Pydantic validation hatası
        message = errorBody.detail.map((e: { msg: string }) => e.msg).join(', ');
      }
    } catch {
      // JSON parse edilemedi, status mesajını kullan
      message = response.statusText || message;
    }

    throw new ApiError(response.status, message, detail);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ────────────────────────────────────────────
// Convenience methods
// ────────────────────────────────────────────

export const api = {
  get: <T>(path: string, options?: RequestInit) =>
    apiClient<T>(path, { method: 'GET', ...options }),

  post: <T>(path: string, body: unknown, options?: RequestInit) =>
    apiClient<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T>(path: string, body: unknown, options?: RequestInit) =>
    apiClient<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    }),

  patch: <T>(path: string, body: unknown, options?: RequestInit) =>
    apiClient<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    apiClient<T>(path, { method: 'DELETE', ...options }),
};
