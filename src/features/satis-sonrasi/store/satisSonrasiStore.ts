/**
 * Satış Sonrası merkezi state yönetimi — TÜM VERİLER API'den gelir, mock yok.
 *
 * API endpoint'leri:
 *   GET /api/v1/support/orders              → siparişler (hızlı)
 *   GET /api/v1/support/operations          → ürünler, kural tabanlı (hızlı, AI yok)
 *   GET /api/v1/support/operations/ai-summary → Gemini AI özeti (arka planda)
 *   GET /api/v1/support/reviews             → yorumlar (hızlı)
 *
 * YÜKLEMe STRATEJİSİ:
 *   Faz 1 — orders + operations + reviews paralel çekilir, UI hemen açılır.
 *   Faz 2 — /operations/ai-summary arka planda çekilir, AI özetleri gelince güncellenir.
 */
import { useState, useEffect, useCallback } from 'react';

export type TaskId = 'siparis' | 'stok' | 'yorum' | 'analiz';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ──────────────────────────────────────────────────────────────────
// Tip tanımları (API response'larıyla eşleşiyor)
// ──────────────────────────────────────────────────────────────────
export interface ApiOrder {
  id: string;
  date: string;
  product: string;
  customer: string;
  quantity: number;
  amount: number;
  status: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  variants: string;
  sold: number;
  stock: number;
  image: string;
  status: 'good' | 'warning' | 'critical';
  aiSummary: string;
  task: TaskId | null;
}

export interface ApiReview {
  id: number;
  product_id: number;
  product: string;
  customer: string;
  date: string;
  rating: number;
  comment: string;
}

export interface StockAlert {
  id: string;
  productName: string;
  remaining: number;
  threshold: number;
}

export interface ProductRow extends ApiProduct {
  pendingTasks: TaskId[];
}

// ──────────────────────────────────────────────────────────────────
// Store state
// ──────────────────────────────────────────────────────────────────
interface StoreState {
  orders: ApiOrder[];
  products: ProductRow[];
  stockAlerts: StockAlert[];
  reviews: ApiReview[];
  completedTasks: Set<TaskId>;
  loading: boolean;
  error: string | null;
}

let _state: StoreState = {
  orders: [],
  products: [],
  stockAlerts: [],
  reviews: [],
  completedTasks: new Set(),
  loading: true,
  error: null,
};

let _listeners: Array<() => void> = [];

function setState(partial: Partial<StoreState>) {
  _state = { ..._state, ...partial };
  _listeners.forEach(fn => fn());
}

export function subscribeStore(fn: () => void) {
  _listeners.push(fn);
  return () => { _listeners = _listeners.filter(l => l !== fn); };
}

export function getSnapshot(): StoreState {
  return _state;
}

// ──────────────────────────────────────────────────────────────────
// Türetme: stok uyarılarını ürün listesinden üret
// ──────────────────────────────────────────────────────────────────
function deriveStockAlerts(products: ApiProduct[]): StockAlert[] {
  return products
    .filter(p => p.stock < 15)
    .map(p => ({
      id: p.id,
      productName: p.name,
      remaining: p.stock,
      threshold: 15,
    }));
}

// ──────────────────────────────────────────────────────────────────
// Türetme: her ürünün pendingTasks listesini oluştur
// ──────────────────────────────────────────────────────────────────
function deriveProductRows(
  products: ApiProduct[],
  orders: ApiOrder[],
  stockAlerts: StockAlert[],
  completedTasks: Set<TaskId>,
): ProductRow[] {
  const pendingOrderProductNames = new Set(
    orders
      .filter(o => o.status === 'hazırlanıyor' || o.status === 'beklemede')
      .map(o => o.product)
  );
  const lowStockProductIds = new Set(stockAlerts.map(a => a.id));

  return products.map(p => {
    const tasks: TaskId[] = [];

    if (!completedTasks.has('siparis') && pendingOrderProductNames.has(p.name)) {
      tasks.push('siparis');
    }
    if (!completedTasks.has('stok') && lowStockProductIds.has(p.id)) {
      tasks.push('stok');
    }
    if (p.task && !completedTasks.has(p.task) && !tasks.includes(p.task)) {
      tasks.push(p.task);
    }

    return { ...p, pendingTasks: tasks };
  });
}

// ──────────────────────────────────────────────────────────────────
// API çağrıları — iki fazlı yükleme
// ──────────────────────────────────────────────────────────────────
let _fetchPromise: Promise<void> | null = null;

export async function fetchStoreData(force = false): Promise<void> {
  if (_fetchPromise && !force) return _fetchPromise;

  _fetchPromise = (async () => {
    setState({ loading: true, error: null });
    try {
      const headers = authHeaders();

      // ── Faz 1: Hızlı veri — paralel, AI beklemez ─────────────────────
      const [ordersRes, opsRes, reviewsRes] = await Promise.all([
        fetch(`${BASE_URL}/support/orders`, { headers }),
        fetch(`${BASE_URL}/support/operations`, { headers }),
        fetch(`${BASE_URL}/support/reviews`, { headers }),
      ]);

      if (!ordersRes.ok || !opsRes.ok) {
        throw new Error('API isteği başarısız');
      }

      const orders: ApiOrder[] = await ordersRes.json();
      const products: ApiProduct[] = await opsRes.json();
      const reviews: ApiReview[] = reviewsRes.ok ? await reviewsRes.json() : [];
      const stockAlerts = deriveStockAlerts(products);
      const productRows = deriveProductRows(products, orders, stockAlerts, _state.completedTasks);

      // UI hemen açılır
      setState({ orders, products: productRows, stockAlerts, reviews, loading: false });

      // ── Faz 2: Arka planda Gemini AI özeti — UI bloklanmaz ────────────
      fetch(`${BASE_URL}/support/operations/ai-summary`, { headers })
        .then(r => r.ok ? r.json() : [])
        .then((aiList: Array<{ id: string; status: string; aiSummary: string; task: string | null }>) => {
          if (!aiList || !aiList.length) return;
          const aiMap = new Map(aiList.map(a => [a.id, a]));

          const enriched: ApiProduct[] = (_state.products as ProductRow[]).map(p => {
            const ai = aiMap.get(p.id);
            if (!ai) return p;
            return {
              ...p,
              status: (ai.status as ApiProduct['status']) || p.status,
              aiSummary: ai.aiSummary || p.aiSummary,
              task: (ai.task as TaskId | null) ?? p.task,
            };
          });

          const newAlerts = deriveStockAlerts(enriched);
          const newRows = deriveProductRows(enriched, _state.orders, newAlerts, _state.completedTasks);
          setState({ products: newRows, stockAlerts: newAlerts });
        })
        .catch(e => console.warn('[Store] AI summary (non-critical):', e));

    } catch (err: any) {
      setState({ loading: false, error: err.message || 'Veri yüklenemedi' });
    } finally {
      _fetchPromise = null;
    }
  })();

  return _fetchPromise;
}

// ──────────────────────────────────────────────────────────────────
// Aksiyon fonksiyonları
// ──────────────────────────────────────────────────────────────────

export function approveOrders(orderIds: string[]) {
  const updatedOrders = _state.orders.map(o =>
    orderIds.includes(o.id) ? { ...o, status: 'kargolandı' } : o
  );
  const stillPending = updatedOrders.some(
    o => o.status === 'hazırlanıyor' || o.status === 'beklemede'
  );
  const completedTasks = stillPending
    ? _state.completedTasks
    : new Set([..._state.completedTasks, 'siparis' as TaskId]);

  const productRows = deriveProductRows(
    _state.products, updatedOrders, _state.stockAlerts, completedTasks
  );
  setState({ orders: updatedOrders, products: productRows, completedTasks });
}

export function resolveStockAlert(alertId: string) {
  const updatedAlerts = _state.stockAlerts.filter(a => a.id !== alertId);
  const completedTasks = updatedAlerts.length === 0
    ? new Set([..._state.completedTasks, 'stok' as TaskId])
    : _state.completedTasks;

  const updatedProducts = _state.products.map(p =>
    p.id === alertId ? { ...p, stock: p.stock + 50 } : p
  );
  const productRows = deriveProductRows(
    updatedProducts, _state.orders, updatedAlerts, completedTasks
  );
  setState({ stockAlerts: updatedAlerts, products: productRows, completedTasks });
}

export function markReviewsRead() {
  const completedTasks = new Set([..._state.completedTasks, 'yorum' as TaskId]);
  const productRows = deriveProductRows(
    _state.products, _state.orders, _state.stockAlerts, completedTasks
  );
  setState({ completedTasks, products: productRows });
}

export function markAnalysisRead() {
  const completedTasks = new Set([..._state.completedTasks, 'analiz' as TaskId]);
  const productRows = deriveProductRows(
    _state.products, _state.orders, _state.stockAlerts, completedTasks
  );
  setState({ completedTasks, products: productRows });
}

// ──────────────────────────────────────────────────────────────────
// React hook
// ──────────────────────────────────────────────────────────────────
export function useSatisSonrasiStore() {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const unsub = subscribeStore(() => forceRender(n => n + 1));
    fetchStoreData();
    return unsub;
  }, []);

  const snap = getSnapshot();

  const pendingOrders = snap.orders.filter(
    o => o.status === 'hazırlanıyor' || o.status === 'beklemede'
  );

  const hasAnalyzedProduct = snap.products.some(p => p.task === 'analiz');
  const unreadReviews = snap.completedTasks.has('yorum') ? [] : snap.reviews;

  const taskCounts: Record<TaskId, number> = {
    siparis: pendingOrders.length,
    stok: snap.stockAlerts.length,
    yorum: unreadReviews.length,
    analiz: snap.completedTasks.has('analiz') ? 0 : (hasAnalyzedProduct ? 1 : 0),
  };

  return {
    orders: snap.orders,
    pendingOrders,
    stockAlerts: snap.stockAlerts,
    reviews: snap.reviews,
    unreadReviews,
    products: snap.products,
    completedTasks: snap.completedTasks,
    loading: snap.loading,
    error: snap.error,
    taskCounts,
    approveOrders,
    resolveStockAlert,
    markReviewsRead,
    markAnalysisRead,
    refetch: useCallback(() => fetchStoreData(true), []),
  };
}
