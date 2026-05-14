# BTK Hackathon 26 – Frontend Geliştirme Promptu
## Cursor için · FRONTEND_GUIDE.md ile uyumlu

> ⚠️ Bu prompt, `FRONTEND_GUIDE.md` ile birlikte kullanılır.
> `FRONTEND_GUIDE.md` **nasıl yazılacağını** belirler. Bu dosya **ne yapılacağını** belirler.
> İkisi çelişirse `FRONTEND_GUIDE.md` önceliklidir.

---

## ROL VE BAĞLAM

Sen deneyimli bir React + TypeScript frontend geliştiricisisin. Aşağıda detaylı süreç raporu verilmiş bir e-ticaret çok ajanlı yönetim platformunun tüm frontend'ini geliştiriyorsun. Kullanıcı, e-ticaret satışı yapan bireysel satıcıdır. Platform onun için bir "online çalışan ajans" gibi davranır.

---

## TECH STACK

```
React 18+           → UI katmanı (FRONTEND_GUIDE.md'den)
TypeScript          → Tip güvenliği
Tailwind CSS        → Stil (token sistemi zorunlu)
Framer Motion       → Animasyon (birincil)
React Bits          → Animasyonlu component kaynağı
Recharts            → Grafik bileşenleri
React Hook Form     → Form yönetimi
Lucide React        → İkon seti
Vite                → Build aracı
```

**API Base URL:** `http://localhost:8000/api`
**WebSocket URL:** `ws://localhost:8000/ws/notifications`

---

## DESIGN TOKENS (tokens.css)

Tüm renk, spacing ve motion değerleri için aşağıdaki token sistemi kullanılır. Hiçbir component'te magic number veya inline renk değeri yazılmaz.

```css
:root {
  /* Proje renk paleti */
  --color-bg:        #0F1A2E;
  --color-fg:        #F0F4F8;
  --color-accent:    #2E5F8A;
  --color-accent-2:  #1E3A5F;
  --color-muted:     #6B7A8D;
  --color-border:    rgba(255,255,255,0.08);
  --color-surface:   rgba(255,255,255,0.04);
  --color-success:   #1A6B3C;
  --color-warning:   #7A5C00;
  --color-danger:    #7A1A1A;

  /* Spacing (8px grid) */
  --space-1: 4px;   --space-2: 8px;    --space-3: 12px;
  --space-4: 16px;  --space-6: 24px;   --space-8: 32px;
  --space-12: 48px; --space-16: 64px;  --space-24: 96px;

  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-body:    'DM Sans', sans-serif;

  /* Motion */
  --duration-fast:  150ms;
  --duration-base:  300ms;
  --duration-slow:  500ms;
  --ease-default:   cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## KLASÖR YAPISI

`FRONTEND_GUIDE.md`'deki yapıya birebir uy:

```
src/
├── components/
│   ├── ui/                   # Button, Input, Badge, KPICard, StatusBadge...
│   ├── layout/               # Sidebar, AppShell
│   ├── composite/            # Modal, Form, DataTable
│   └── animation/            # Reveal.tsx, Stagger.tsx, PageTransition.tsx, variants.ts
│
├── features/
│   ├── dashboard/
│   │   ├── components/
│   │   └── hooks/
│   ├── finans/
│   │   ├── components/
│   │   └── hooks/
│   ├── analizler/
│   │   ├── components/
│   │   └── hooks/
│   ├── satis-oncesi/
│   │   ├── components/
│   │   └── hooks/
│   ├── satis-sureci/
│   │   ├── components/
│   │   └── hooks/
│   ├── satis-sonrasi/
│   │   ├── components/
│   │   └── hooks/
│   └── ayarlar/
│       ├── components/
│       └── hooks/
│
├── hooks/
│   ├── useSafeAnimation.ts   # useReducedMotion wrapper (FRONTEND_GUIDE.md zorunlu)
│   ├── useApi.ts             # API çağrı hook'u
│   └── useNotifications.ts  # WebSocket bildirim hook'u
│
├── styles/
│   ├── tokens.css
│   ├── reset.css
│   └── typography.css
│
└── types/
    └── index.ts
```

---

## API HOOK (hooks/useApi.ts)

`lib/api.ts` yerine `FRONTEND_GUIDE.md`'deki `features/[feature]/hooks/` yapısına uygun olarak merkezi hook kullanılır:

```typescript
// hooks/useApi.ts
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}
```

Her feature kendi hook'unu yazar:

```typescript
// features/dashboard/hooks/useDashboardData.ts
import { apiFetch } from '@/hooks/useApi';

export const useDashboardData = () => {
  // sadece dashboard verisi — başka şey yok
};
```

---

## ANIMATION VARIANTS (components/animation/variants.ts)

Tüm animasyonlar buradan import edilir. Hiçbir component'te inline animasyon değeri yazılmaz.

```typescript
export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
};
```

---

## MOCK VERİ NOTU

Backend hazır olmadan önce her feature hook'unda mock veri kullan:

```typescript
// features/dashboard/hooks/useDashboardData.ts
// TODO: Replace with real apiFetch call
const mockData = { totalRevenue: 12400, activeProducts: 8 };
```

Backend hazır olunca sadece mock satırı `apiFetch(...)` ile değiştirilir. Sayfa kodu dokunulmaz.

---

## GENEL KURALLAR

1. Tüm sayfalar `src/pages/` veya Vite routing yapısında organize edilir.
2. Ortak layout: sol `Sidebar` (components/layout/) + sağda içerik alanı.
3. Sidebar menü: Dashboard · Gelir–Gider · Analizler · Ajanlar (alt menü: Satış Öncesi / Satış Süreci / Satış Sonrası) · Ayarlar.
4. Tüm sayfalar mobil responsive.
5. Türkçe arayüz dili.
6. Her sayfada loading, error ve empty state bulunur — her biri ayrı component olarak `components/ui/` altında.
7. JWT token `localStorage`'da tutulur; `useApi.ts` her istekte header'a ekler.
8. WebSocket bağlantısı `hooks/useNotifications.ts` üzerinden yönetilir; tüm app'e context ile dağıtılır.
9. `FRONTEND_GUIDE.md`'deki SOLID kuralları, animasyon hiyerarşisi ve yasaklı pratikler her component için geçerlidir.

---

## SAYFA 1 – DASHBOARD (`/dashboard`)

**Amaç:** Kullanıcının platforma girdiğinde anlık durumu görmesi.

### Feature Yapısı
```
features/dashboard/
├── components/
│   ├── KPIGrid.tsx         # 4 KPI kartı yan yana
│   ├── RevenueChart.tsx    # Aylık gelir grafiği
│   ├── RecentAnalyses.tsx  # Son analizler listesi
│   └── AlertBanner.tsx     # Uyarı bannerleri
└── hooks/
    └── useDashboardData.ts # Tüm dashboard verisi buradan
```

### Bileşenler ve API

**KPI Kartları (4 adet, `Stagger` wrapper ile)**
- Toplam Gelir (Bu Ay): `GET /api/finance/summary?period=monthly` → `income`
- Aktif Ürün Sayısı: `GET /api/products?active=true` → count
- Bekleyen Uyarı: `GET /api/notifications?is_read=false` → count
- Tamamlanan Analiz: `GET /api/analysis/history` → count
- Her kart `scaleIn` variant ile mount animasyonu alır

**Gelir Trendi Grafiği**
- Recharts `LineChart`
- `GET /api/finance/summary?period=monthly`
- `Reveal` wrapper ile `fadeUp` animasyonu

**Son Analizler Listesi**
- `GET /api/analysis/history` → ilk 5 kayıt
- Kart listesi, `staggerContainer` ile sıralı giriş animasyonu
- Karta tıklanınca `/analizler/{id}` sayfasına yönlendir

**Uyarı Bannerleri**
- Stok kritik → danger rengi
- Yeni yorum → warning rengi
- İade talebi → warning rengi
- `GET /api/notifications?is_read=false` verisinden üret
- `fadeIn` ile mount animasyonu

**Canlı Bildirim Göstergesi**
- `hooks/useNotifications.ts` üzerinden WebSocket
- Sağ üst köşede bağlantı durumu (yeşil/kırmızı nokta)
- Yeni bildirimde banner otomatik güncellenir

---

## SAYFA 2 – GELİR–GİDER (`/finans`)

**Amaç:** Muhasebe ve finans paneli.

### Feature Yapısı
```
features/finans/
├── components/
│   ├── PeriodSelector.tsx    # Günlük/Haftalık/Aylık seçici
│   ├── FinansSummary.tsx     # 3 özet kart
│   ├── RevenueExpenseChart.tsx
│   ├── IncomeTable.tsx
│   ├── ExpenseTable.tsx
│   ├── AddExpenseModal.tsx
│   ├── NetProfitView.tsx
│   └── GeminiReportCard.tsx
└── hooks/
    ├── useFinansSummary.ts
    └── useExpenses.ts
```

### Bileşenler ve API

**Dönem Seçici**
- Günlük / Haftalık / Aylık buton grubu
- Seçim state'i tüm sayfa hook'larına props olarak geçer

**Özet Kartları (3 adet, `Stagger` ile)**
- Toplam Gelir · Toplam Gider · Net Kâr
- `GET /api/finance/summary?period={seçilen}`
- Net Kâr: pozitifse `--color-success`, negatifse `--color-danger`

**Gelir–Gider Grafiği**
- Recharts `BarChart`: yan yana gelir (accent) ve gider (danger)
- `Reveal` + `fadeUp`

**4 Sekme: Gelir / Gider / Net Kâr / Gemini Raporu**

Gelir sekmesi:
- `GET /api/finance/summary?period={seçilen}` → gelir detayı
- Tablo: tarih, platform, ürün, tutar

Gider sekmesi:
- `GET /api/finance/expenses`
- Tablo: tarih, kategori, açıklama, tutar, tekrarlayan badge
- "Gider Ekle" butonu → `AddExpenseModal`

Gider Ekleme Modalı (`components/composite/` altında):
- Kategori dropdown: Kargo / Platform Komisyonu / Reklam / Ürün Alış Maliyeti / İşçilik / Diğer
- Tutar, açıklama, tarih, tekrarlayan toggle
- `POST /api/finance/expense`
- `scaleIn` ile modal giriş animasyonu

Net Kâr sekmesi:
- Dönem bazlı: Gelir − Tüm Giderler
- Özet kart + açıklama metni

Gemini Raporu sekmesi:
- "Rapor Üret" butonu → `GET /api/finance/report`
- Loading sırasında `LoadingSpinner`
- Gelince: özet metin + öneri maddeleri listesi (`staggerContainer`)

---

## SAYFA 3 – ANALİZLER (`/analizler`)

**Amaç:** Aktif ajanları ve geçmiş raporları göster.

### Feature Yapısı
```
features/analizler/
├── components/
│   ├── ActiveAgents.tsx      # Çalışan ajanlar listesi
│   ├── AgentStatusCard.tsx   # Tek ajan durum kartı
│   ├── PastReports.tsx       # Geçmiş raporlar listesi
│   ├── ReportCard.tsx        # Tek rapor kartı
│   └── ReportDetailModal.tsx # Tam rapor modalı
└── hooks/
    ├── useAgentStatus.ts     # polling her 3sn
    └── useAnalysisHistory.ts
```

### Bileşenler ve API

**Aktif Ajanlar Sekmesi**
- `GET /api/agents/status` → polling her 3 saniyede bir
- Her kart: ürün adı, ajan tipi, durum (spinner / yeşil tik / kırmızı X), başlangıç zamanı
- `staggerContainer` ile liste animasyonu

**Geçmiş Raporlar Sekmesi**
- `GET /api/analysis/history`
- Filtre: tarih aralığı, ürün adı arama
- Her kart `fadeUp` ile giriş, "Tam Raporu Gör" → `ReportDetailModal`

**Rapor Detay Modalı**
- `GET /api/analysis/{id}`
- İki sütun: Pazar Analizi + Fiyat Analizi
- Alt: "Satışa Geç" butonu → `/ajanlar/satis-sureci?analysisId={id}`

---

## SAYFA 4 – SATIŞ ÖNCESİ (`/ajanlar/satis-oncesi`)

**Amaç:** "Bu ürünü satmalı mıyım, kaça satmalıyım?"

### Feature Yapısı
```
features/satis-oncesi/
├── components/
│   ├── StepIndicator.tsx     # Adım göstergesi
│   ├── ProductInfoStep.tsx   # Adım 1
│   ├── CostDetailsStep.tsx   # Adım 2
│   ├── AnalysisStep.tsx      # Adım 3 — loading + sonuç
│   ├── MarketAnalysisCard.tsx
│   └── PriceAnalysisCard.tsx
└── hooks/
    ├── useAnalysisForm.ts    # form state yönetimi
    └── useAnalysisPolling.ts # GET /api/analysis/{id} polling
```

### Adım Adım Form (3 Adım)

**Adım 1 – Ürün Bilgisi**
- Ürün adı input (zorunlu, placeholder: "Faber-Castell 0.5mm Versatil Kalem")
- Fotoğraf yükleme (opsiyonel, sürükle-bırak, 5MB limit)
- "İleri" → `AnimatedButton` (`whileHover scale:1.02`, `whileTap scale:0.98`)

**Adım 2 – Maliyet Detayları**
- Toptan alış fiyatı (TL), stok adedi, kargo ücreti (TL)
- KDV oranı dropdown: 0 / 1 / 8 / 18 / 20
- Diğer giderler (TL, opsiyonel)
- "Geri" ve "Analizi Başlat" butonları

**Adım 3 – Analiz**
- `POST /api/analysis/start` → ID al
- `useAnalysisPolling.ts`: `GET /api/analysis/{id}` her 3sn
- Loading: Framer Motion `animate` ile dönen ikon + "Ajanlar çalışıyor..." yazısı
- Sonuç: `MarketAnalysisCard` + `PriceAnalysisCard` yan yana, `staggerContainer` ile giriş
- Alt: "Raporu Kaydet ve Çık" · "Satışa Geç" butonları

---

## SAYFA 5 – SATIŞ SÜRECİ (`/ajanlar/satis-sureci`)

**Amaç:** Ürünü hazırlayıp platforma yayınla.

### Feature Yapısı
```
features/satis-sureci/
├── components/
│   ├── WizardStepBar.tsx     # Üstteki adım çubuğu
│   ├── VisualStep.tsx        # Adım 1
│   ├── SeoStep.tsx           # Adım 2
│   ├── PriceStep.tsx         # Adım 3
│   ├── PlatformStep.tsx      # Adım 4
│   ├── ConfirmStep.tsx       # Adım 5
│   └── SuccessScreen.tsx     # Yayınlandı ekranı
└── hooks/
    └── useListingWizard.ts   # tüm wizard state
```

### Sihirbaz (5 Adım)

Adım göstergesi üstte sabit: Görsel → SEO → Fiyat → Platform → Onay
Adımlar arası geçiş `PageTransition` ile animasyonlu.

**Adım 1 – Görsel**
- Sürükle-bırak yükleme alanı
- `POST /api/listing/prepare`
- Orijinal (sol) / işlenmiş (sağ) önizleme, `fadeIn` ile giriş

**Adım 2 – SEO**
- `GET /api/listing/{id}/preview`
- Düzenlenebilir: başlık (maks 100 kar.), açıklama (maks 500 kar.), etiketler (chip input)
- "Gemini ile Yeniden Üret" butonu
- Karakter sayacı her input altında

**Adım 3 – Fiyat**
- Önerilen fiyat bandı: vurgulu banner (`--color-accent` border)
- Kullanıcı kesin fiyat yazar
- Band dışında girişte sarı uyarı (engelleyici değil)

**Adım 4 – Platform**
- Platform kartları: Trendyol · Hepsiburada · Amazon TR · Etsy
- Logo + isim + checkbox
- En az 1 seçili olmadan "İleri" disabled

**Adım 5 – Onay**
- Sayfa içi özet: görsel, SEO başlığı, fiyat, seçili platformlar
- "Yayınla" → `POST /api/listing/publish`
- Loading: "Ürün platformlara gönderiliyor..."
- Başarı: `scaleIn` animasyonlu yeşil tik + "Ürün Yayınlandı!" + "Satış Sonrası Takibe Git"

---

## SAYFA 6 – SATIŞ SONRASI (`/ajanlar/satis-sonrasi`)

**Amaç:** Sipariş, stok, yorum ve iade takibi.

### Feature Yapısı
```
features/satis-sonrasi/
├── components/
│   ├── OrdersTab.tsx
│   ├── StockTab.tsx
│   ├── StockCard.tsx         # Tek ürün stok kartı
│   ├── ReviewsTab.tsx
│   ├── ReviewCard.tsx
│   └── ReturnsTab.tsx
└── hooks/
    ├── useOrders.ts
    ├── useStock.ts
    ├── useReviews.ts
    └── useReturns.ts
```

### 4 Sekme

**Siparişler**
- `GET /api/orders` (filtre: tarih, platform, durum)
- Tablo: Sipariş No · Tarih · Ürün · Platform · Tutar · Durum badge
- `staggerContainer` ile satır animasyonu

**Stok Durumu**
- `GET /api/stock`
- Her `StockCard`: ürün adı, büyük stok sayısı, progress bar (eşik kırmızı çizgi)
- Eşik altı: kart `--color-danger` border ile vurgulanır
- Inline eşik düzenleme: `PATCH /api/stock/{product_id}`

**Yorumlar**
- `GET /api/reviews` (filtre: platform, duygu)
- Her `ReviewCard`: platform badge, yorum metni, duygu etiketi (success/danger/warning), tarih
- `fadeUp` ile liste animasyonu

**İadeler**
- `GET /api/returns`
- Her kart: sipariş no, ürün adı, Gemini gerekçe özeti, durum badge

---

## SAYFA 7 – AYARLAR (`/ayarlar`)

### Feature Yapısı
```
features/ayarlar/
├── components/
│   ├── UserInfoForm.tsx
│   ├── PlatformConnections.tsx
│   ├── ConnectPlatformModal.tsx
│   └── NotificationPrefs.tsx
└── hooks/
    └── useSettings.ts
```

### Bölümler

**Kullanıcı Bilgileri**
- Ad, soyad, e-posta input
- Şifre değiştirme: mevcut + yeni + tekrar
- "Kaydet" → `AnimatedButton`

**Platform Bağlantıları**
- Trendyol · Hepsiburada · Amazon TR · Etsy
- Bağlı: yeşil tik + "Bağlantıyı Kaldır"
- Bağlı değil: "Bağla" → `ConnectPlatformModal` (API anahtarı girişi)
- Modal: `scaleIn` animasyonu

**Bildirim Tercihleri**
- E-posta bildirimi toggle
- Varsayılan stok eşiği input
- "Kaydet"

---

## ORTAK UI BİLEŞENLERİ

`FRONTEND_GUIDE.md`'deki yapıya göre `components/ui/` ve `components/animation/` altında:

| Bileşen | Konum | Açıklama |
|---|---|---|
| `Sidebar` | `components/layout/` | Sol nav, aktif sayfa vurgusu, alt menü |
| `KPICard` | `components/ui/` | props: title, value, unit, trend |
| `StatusBadge` | `components/ui/` | props: status (tamamlandı/bekliyor/hata/olumlu/olumsuz) |
| `LoadingSpinner` | `components/ui/` | inline veya tam ekran |
| `EmptyState` | `components/ui/` | props: icon, title, description, actionLabel, onAction |
| `ErrorState` | `components/ui/` | props: message, onRetry |
| `ConfirmModal` | `components/composite/` | props: title, description, onConfirm, onCancel |
| `Reveal` | `components/animation/` | fadeUp/fadeIn/slideIn variant wrapper |
| `Stagger` | `components/animation/` | staggerChildren wrapper |
| `PageTransition` | `components/animation/` | sayfa geçiş animasyonu |
| `AnimatedButton` | `components/ui/` | whileHover + whileTap, ButtonProps interface |
| `NotificationProvider` | `hooks/` | WebSocket context, tüm app'e sarılır |

---

## GELİŞTİRME ÖNCELİK SIRASI

1. Token sistemi + klasör yapısı + `variants.ts` + `AnimatedButton`
2. `Sidebar` + routing + `AppShell` layout
3. Auth sayfaları (login/register)
4. Dashboard
5. Satış Öncesi (demo için kritik)
6. Satış Süreci (demo için kritik)
7. Analizler
8. Gelir–Gider
9. Satış Sonrası
10. Ayarlar
