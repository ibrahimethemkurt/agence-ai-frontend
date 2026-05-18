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

  // Satış Süreci (Listing) API
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/listing/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Resim yüklenemedi');
    return res.json();
  },

  async prepareListing(data: { product_name: string; photo_url: string; source_type?: string }) {
    const res = await fetch(`${BASE_URL}/listing/prepare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail ? JSON.stringify(errorData.detail) : 'Hazırlık süreci başlatılamadı');
    }
    return res.json();
  },

  async publishListing(data: { listing_id: number; price: number; platforms: string[]; seo_title: string; seo_description: string; seo_tags: string[] }) {
    const res = await fetch(`${BASE_URL}/listing/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail ? JSON.stringify(errorData.detail) : 'Yayınlama işlemi başarısız');
    }
    return res.json();
  },

  async getListings() {
    const res = await fetch(`${BASE_URL}/listing/`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Satıştaki ürünler alınamadı');
    return res.json();
  },

  async getListing(id: number) {
    const res = await fetch(`${BASE_URL}/listing/${id}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Listeleme durumu alınamadı');
    return res.json();
  },

  async getDashboardData() {
    const res = await fetch(`${BASE_URL}/dashboard/`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Dashboard verisi alınamadı');
    return res.json();
  },

  async getFinanceData(period: string = 'Aylık') {
    const res = await fetch(`${BASE_URL}/finance/?period=${encodeURIComponent(period)}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Finans verisi alınamadı');
    return res.json();
  },

  async addTransaction(data: { title: string; amount: number; category: string; type: 'income' | 'expense' }) {
    const res = await fetch(`${BASE_URL}/finance/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('İşlem eklenemedi');
    return res.json();
  },

  // Support
  async getSupportOrders() {
    const res = await fetch(`${BASE_URL}/support/orders`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Siparişler alınamadı');
    return res.json();
  },

  async getSupportReviews() {
    const res = await fetch(`${BASE_URL}/support/reviews`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Yorumlar alınamadı');
    return res.json();
  },

  async chatWithAssistant(data: { message: string; mode: string }) {
    const res = await fetch(`${BASE_URL}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Asistan yanıt veremedi');
    return res.json();
  },
};
