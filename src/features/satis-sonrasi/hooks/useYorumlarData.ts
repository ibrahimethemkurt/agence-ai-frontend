import { useState } from 'react';

// --- TYPES ---
export interface ReviewTag {
  label: string;
  sentiment: 'positive' | 'negative';
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  rating: number;
  sentiment: 'positive' | 'negative';
  text: string;
  tags: ReviewTag[];
  date: string;
}

export interface ReviewProduct {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
}

export interface AnalysisMetric {
  category: string;
  positive: number;
  negative: number;
}

// --- MOCK PRODUCTS ---
const PRODUCTS: ReviewProduct[] = [
  { id: 'rp1', name: 'Akıllı Saat Pro Max', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=100&q=80', rating: 4.5, reviewCount: 312 },
  { id: 'rp2', name: 'Minimalist Sırt Çantası', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=100&q=80', rating: 4.2, reviewCount: 187 },
  { id: 'rp3', name: 'Kablosuz Kulaklık V2', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80', rating: 3.8, reviewCount: 534 },
  { id: 'rp4', name: 'Mekanik Klavye RGB', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=100&q=80', rating: 4.7, reviewCount: 96 },
  { id: 'rp5', name: 'Ergonomik Oyuncu Faresi', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=100&q=80', rating: 4.1, reviewCount: 245 },
  { id: 'rp6', name: 'USB-C Hub Adaptör', image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=100&q=80', rating: 3.5, reviewCount: 78 },
];

// --- MOCK REVIEWS ---
const ALL_REVIEWS: Review[] = [
  // Akıllı Saat Pro Max
  { id: 'r1', productId: 'rp1', productName: 'Akıllı Saat Pro Max', rating: 5, sentiment: 'positive', text: 'Harika bir ürün, kalitesi çok iyi. Pil ömrü 3 gün rahat gidiyor.', tags: [{ label: 'ÜRÜN', sentiment: 'positive' }, { label: 'KALİTE', sentiment: 'positive' }], date: '15 May 2026' },
  { id: 'r2', productId: 'rp1', productName: 'Akıllı Saat Pro Max', rating: 4, sentiment: 'positive', text: 'Güzel saat ama kayış biraz sert, zamanla yumuşar umarım.', tags: [{ label: 'ÜRÜN', sentiment: 'positive' }, { label: 'KALİTE', sentiment: 'negative' }], date: '14 May 2026' },
  { id: 'r3', productId: 'rp1', productName: 'Akıllı Saat Pro Max', rating: 2, sentiment: 'negative', text: 'Ekran çok küçük, beklediğimden farklı. İade edeceğim.', tags: [{ label: 'BOYUT', sentiment: 'negative' }, { label: 'ÜRÜN', sentiment: 'negative' }], date: '12 May 2026' },
  // Minimalist Sırt Çantası
  { id: 'r4', productId: 'rp2', productName: 'Minimalist Sırt Çantası', rating: 5, sentiment: 'positive', text: 'Tam istediğim gibi, çok şık ve kullanışlı. Laptop bölmesi mükemmel.', tags: [{ label: 'ÜRÜN', sentiment: 'positive' }, { label: 'KALİTE', sentiment: 'positive' }, { label: 'PAKETLEME', sentiment: 'positive' }], date: '13 May 2026' },
  { id: 'r5', productId: 'rp2', productName: 'Minimalist Sırt Çantası', rating: 3, sentiment: 'negative', text: 'Rengi fotoğraftakinden farklı geldi, biraz hayal kırıklığı.', tags: [{ label: 'ÜRÜN', sentiment: 'negative' }, { label: 'SATICI', sentiment: 'negative' }], date: '10 May 2026' },
  // Kablosuz Kulaklık V2
  { id: 'r6', productId: 'rp3', productName: 'Kablosuz Kulaklık V2', rating: 4, sentiment: 'positive', text: 'Ses kalitesi gayet iyi, bass seviyesi tatmin edici.', tags: [{ label: 'ÜRÜN', sentiment: 'positive' }, { label: 'KALİTE', sentiment: 'positive' }], date: '14 May 2026' },
  { id: 'r7', productId: 'rp3', productName: 'Kablosuz Kulaklık V2', rating: 1, sentiment: 'negative', text: 'Kargo 10 gün sürdü ve kutu ezilmiş geldi. Ürün çalışmıyor, çok kötü.', tags: [{ label: 'KARGO', sentiment: 'negative' }, { label: 'PAKETLEME', sentiment: 'negative' }, { label: 'ÜRÜN', sentiment: 'negative' }], date: '11 May 2026' },
  { id: 'r8', productId: 'rp3', productName: 'Kablosuz Kulaklık V2', rating: 5, sentiment: 'positive', text: 'Bu fiyata bu kalite harika! Kargo da çok hızlı geldi.', tags: [{ label: 'FİYAT', sentiment: 'positive' }, { label: 'KARGO', sentiment: 'positive' }, { label: 'ÜRÜN', sentiment: 'positive' }], date: '09 May 2026' },
  { id: 'r9', productId: 'rp3', productName: 'Kablosuz Kulaklık V2', rating: 2, sentiment: 'negative', text: 'Boyutu çok büyük, kulağıma oturmuyor. İade ettim.', tags: [{ label: 'BOYUT', sentiment: 'negative' }], date: '08 May 2026' },
  // Mekanik Klavye RGB
  { id: 'r10', productId: 'rp4', productName: 'Mekanik Klavye RGB', rating: 5, sentiment: 'positive', text: 'Mükemmel tuş hissi! RGB aydınlatma çok güzel. Oyunlar için birebir.', tags: [{ label: 'ÜRÜN', sentiment: 'positive' }, { label: 'KALİTE', sentiment: 'positive' }], date: '15 May 2026' },
  { id: 'r11', productId: 'rp4', productName: 'Mekanik Klavye RGB', rating: 4, sentiment: 'positive', text: 'Fiyat performans olarak çok iyi. Paketleme de özenli.', tags: [{ label: 'FİYAT', sentiment: 'positive' }, { label: 'PAKETLEME', sentiment: 'positive' }], date: '12 May 2026' },
  // Ergonomik Oyuncu Faresi
  { id: 'r12', productId: 'rp5', productName: 'Ergonomik Oyuncu Faresi', rating: 4, sentiment: 'positive', text: 'El kavraması çok rahat, uzun süre kullanımda yormuyor.', tags: [{ label: 'ÜRÜN', sentiment: 'positive' }, { label: 'KALİTE', sentiment: 'positive' }], date: '13 May 2026' },
  { id: 'r13', productId: 'rp5', productName: 'Ergonomik Oyuncu Faresi', rating: 2, sentiment: 'negative', text: 'Scroll tuşu 1 haftada bozuldu. Kalitesiz malzeme kullanılmış.', tags: [{ label: 'KALİTE', sentiment: 'negative' }, { label: 'ÜRÜN', sentiment: 'negative' }], date: '10 May 2026' },
  { id: 'r14', productId: 'rp5', productName: 'Ergonomik Oyuncu Faresi', rating: 3, sentiment: 'negative', text: 'Fiyatına göre idare eder ama satıcı iletişimi çok kötü.', tags: [{ label: 'FİYAT', sentiment: 'negative' }, { label: 'SATICI', sentiment: 'negative' }], date: '07 May 2026' },
  // USB-C Hub Adaptör
  { id: 'r15', productId: 'rp6', productName: 'USB-C Hub Adaptör', rating: 3, sentiment: 'negative', text: 'İdare eder ama ısınma sorunu var, uzun süre kullanınca yanıyor.', tags: [{ label: 'KALİTE', sentiment: 'negative' }, { label: 'ÜRÜN', sentiment: 'negative' }], date: '11 May 2026' },
  { id: 'r16', productId: 'rp6', productName: 'USB-C Hub Adaptör', rating: 5, sentiment: 'positive', text: 'Kompakt tasarım, tüm portları çalışıyor. Çok memnunum.', tags: [{ label: 'ÜRÜN', sentiment: 'positive' }, { label: 'BOYUT', sentiment: 'positive' }], date: '09 May 2026' },
];

// --- ANALYSIS DATA PER PRODUCT ---
const ANALYSIS_DATA: Record<string, AnalysisMetric[]> = {
  all: [
    { category: 'Ürün', positive: 248, negative: 173 },
    { category: 'Kargo', positive: 34, negative: 12 },
    { category: 'Fiyat', positive: 15, negative: 9 },
    { category: 'Paketleme', positive: 22, negative: 38 },
    { category: 'Kalite', positive: 58, negative: 168 },
    { category: 'Boyut', positive: 14, negative: 342 },
    { category: 'Satıcı', positive: 4, negative: 8 },
  ],
  rp1: [
    { category: 'Ürün', positive: 60, negative: 20 },
    { category: 'Kargo', positive: 8, negative: 2 },
    { category: 'Fiyat', positive: 5, negative: 3 },
    { category: 'Paketleme', positive: 10, negative: 5 },
    { category: 'Kalite', positive: 40, negative: 10 },
    { category: 'Boyut', positive: 5, negative: 30 },
    { category: 'Satıcı', positive: 2, negative: 1 },
  ],
  rp2: [
    { category: 'Ürün', positive: 45, negative: 15 },
    { category: 'Kargo', positive: 5, negative: 3 },
    { category: 'Fiyat', positive: 3, negative: 2 },
    { category: 'Paketleme', positive: 8, negative: 4 },
    { category: 'Kalite', positive: 20, negative: 8 },
    { category: 'Boyut', positive: 6, negative: 10 },
    { category: 'Satıcı', positive: 1, negative: 5 },
  ],
  rp3: [
    { category: 'Ürün', positive: 80, negative: 60 },
    { category: 'Kargo', positive: 10, negative: 8 },
    { category: 'Fiyat', positive: 6, negative: 3 },
    { category: 'Paketleme', positive: 3, negative: 20 },
    { category: 'Kalite', positive: 15, negative: 50 },
    { category: 'Boyut', positive: 4, negative: 120 },
    { category: 'Satıcı', positive: 1, negative: 2 },
  ],
  rp4: [
    { category: 'Ürün', positive: 30, negative: 5 },
    { category: 'Kargo', positive: 4, negative: 1 },
    { category: 'Fiyat', positive: 2, negative: 1 },
    { category: 'Paketleme', positive: 3, negative: 2 },
    { category: 'Kalite', positive: 10, negative: 3 },
    { category: 'Boyut', positive: 2, negative: 5 },
    { category: 'Satıcı', positive: 0, negative: 1 },
  ],
  rp5: [
    { category: 'Ürün', positive: 25, negative: 40 },
    { category: 'Kargo', positive: 2, negative: 1 },
    { category: 'Fiyat', positive: 1, negative: 2 },
    { category: 'Paketleme', positive: 1, negative: 5 },
    { category: 'Kalite', positive: 5, negative: 60 },
    { category: 'Boyut', positive: 2, negative: 100 },
    { category: 'Satıcı', positive: 1, negative: 1 },
  ],
  rp6: [
    { category: 'Ürün', positive: 10, negative: 30 },
    { category: 'Kargo', positive: 1, negative: 0 },
    { category: 'Fiyat', positive: 1, negative: 1 },
    { category: 'Paketleme', positive: 0, negative: 4 },
    { category: 'Kalite', positive: 3, negative: 29 },
    { category: 'Boyut', positive: 1, negative: 65 },
    { category: 'Satıcı', positive: 0, negative: 0 },
  ],
};

// --- HOOK ---
export const useYorumlarData = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const products = PRODUCTS;

  const filteredReviews = selectedProductId
    ? ALL_REVIEWS.filter(r => r.productId === selectedProductId)
    : ALL_REVIEWS;

  const analysisData = ANALYSIS_DATA[selectedProductId || 'all'];

  const totalReviews = PRODUCTS.reduce((sum, p) => sum + p.reviewCount, 0);
  const avgRating = +(PRODUCTS.reduce((sum, p) => sum + p.rating * p.reviewCount, 0) / totalReviews).toFixed(1);
  const positiveCount = ALL_REVIEWS.filter(r => r.sentiment === 'positive').length;
  const positiveRatio = Math.round((positiveCount / ALL_REVIEWS.length) * 100);
  const topProduct = [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount)[0];

  return {
    products,
    reviews: filteredReviews,
    analysisData,
    selectedProductId,
    setSelectedProductId,
    stats: {
      totalReviews,
      avgRating,
      positiveRatio,
      topProduct,
    },
  };
};
