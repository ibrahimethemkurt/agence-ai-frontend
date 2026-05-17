const BASE_URL = 'http://localhost:8000/api/v1';

function getToken(): string | null {
  return localStorage.getItem('access_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // AUTH
  async login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'Giriş başarısız');
    const data = await res.json();
    localStorage.setItem('access_token', data.access_token);
    return data;
  },

  async register(payload: {
    full_name: string;
    company_name: string;
    email: string;
    password: string;
    password_confirm: string;
  }) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'Kayıt başarısız');
    return res.json();
  },

  // ANALYSIS
  async startAnalysis(payload: { product_name: string; photo_url?: string; inputs: Record<string, any> }) {
    const res = await fetch(`${BASE_URL}/analysis/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'Analiz başlatılamadı');
    return res.json();
  },

  async getAnalysis(id: number) {
    const res = await fetch(`${BASE_URL}/analysis/${id}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Analiz durumu alınamadı');
    return res.json();
  },

  async getUserAnalyses() {
    const res = await fetch(`${BASE_URL}/analysis/`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Analizler alınamadı');
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Kullanıcı bilgisi alınamadı');
    return res.json();
  },

  logout() {
    localStorage.removeItem('access_token');
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
