import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:8000/api/v1';

function getToken() {
  return localStorage.getItem('access_token');
}

// ─── Types ────────────────────────────────────────────────────────────────────

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
  customer?: string;
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

// ─── Sentiment & Tag helpers ───────────────────────────────────────────────────

function getSentiment(rating: number): 'positive' | 'negative' {
  return rating >= 4 ? 'positive' : 'negative';
}

// Keyword → tag label mapping (Turkish e-commerce common complaint categories)
const TAG_RULES: Array<{ keywords: string[]; label: string }> = [
  { keywords: ['kargo', 'teslimat', 'gönderim', 'kurye', 'ulaşt', 'paket'], label: 'KARGO' },
  { keywords: ['kalite', 'sağlam', 'dayanıklı', 'bozuldu', 'kırıldı', 'koptu', 'çalışmıyor', 'arıza'], label: 'KALİTE' },
  { keywords: ['boyut', 'küçük', 'büyük', 'beden', 'ölçü', 'uymuyor'], label: 'BOYUT' },
  { keywords: ['fiyat', 'pahalı', 'ucuz', 'değer', 'para'], label: 'FİYAT' },
  { keywords: ['paket', 'kutu', 'ambalaj', 'ezil', 'hasar'], label: 'PAKETLEME' },
  { keywords: ['satıcı', 'mağaza', 'iletişim', 'yanıt', 'müşteri hizmet'], label: 'SATICI' },
  { keywords: ['renk', 'görünüm', 'farklı', 'fotoğraf', 'resim', 'görsel'], label: 'GÖRÜNÜM' },
  { keywords: ['ürün', 'özellik', 'performans', 'kullanım'], label: 'ÜRÜN' },
];

function extractTags(comment: string, sentiment: 'positive' | 'negative'): ReviewTag[] {
  if (!comment) return [{ label: 'ÜRÜN', sentiment }];
  const lower = comment.toLowerCase();
  const found: ReviewTag[] = [];
  for (const rule of TAG_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      // Determine tag sentiment: if overall negative review and tag is complaint keyword → negative
      const tagSentiment: 'positive' | 'negative' =
        sentiment === 'negative' &&
        ['KARGO', 'KALİTE', 'BOYUT', 'SATICI', 'PAKETLEME', 'GÖRÜNÜM'].includes(rule.label)
          ? 'negative'
          : sentiment;
      found.push({ label: rule.label, sentiment: tagSentiment });
    }
  }
  return found.length > 0 ? found.slice(0, 3) : [{ label: 'ÜRÜN', sentiment }];
}

function buildAnalysisData(reviews: Review[]): AnalysisMetric[] {
  const cats: Record<string, { positive: number; negative: number }> = {
    Ürün: { positive: 0, negative: 0 },
    Kargo: { positive: 0, negative: 0 },
    Fiyat: { positive: 0, negative: 0 },
    Paketleme: { positive: 0, negative: 0 },
    Kalite: { positive: 0, negative: 0 },
    Boyut: { positive: 0, negative: 0 },
    Satıcı: { positive: 0, negative: 0 },
  };

  const labelToKey: Record<string, string> = {
    ÜRÜN: 'Ürün', KARGO: 'Kargo', FİYAT: 'Fiyat',
    PAKETLEME: 'Paketleme', KALİTE: 'Kalite', BOYUT: 'Boyut',
    SATICI: 'Satıcı', GÖRÜNÜM: 'Ürün',
  };

  for (const review of reviews) {
    for (const tag of review.tags) {
      const key = labelToKey[tag.label] ?? 'Ürün';
      if (cats[key]) cats[key][tag.sentiment === 'positive' ? 'positive' : 'negative']++;
    }
  }

  return Object.entries(cats).map(([category, counts]) => ({ category, ...counts }));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useYorumlarData = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<ReviewProduct[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) return;

      try {
        setLoading(true);

        // Fetch reviews
        const reviewsRes = await fetch(`${BASE_URL}/support/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch products (via operations endpoint which has image + name)
        const productsRes = await fetch(`${BASE_URL}/support/operations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!reviewsRes.ok || !productsRes.ok) return;

        const rawReviews = await reviewsRes.json();
        const rawProducts = await productsRes.json();

        // Build product map for quick lookup
        const productMap: Record<string, { name: string; image: string }> = {};
        for (const p of rawProducts) {
          productMap[String(p.id)] = { name: p.name, image: p.image };
        }

        // Transform reviews
        const transformed: Review[] = rawReviews
          .filter((r: any) => r.comment) // only reviews with text
          .map((r: any) => {
            const sentiment = getSentiment(r.rating);
            const tags = extractTags(r.comment || '', sentiment);
            return {
              id: String(r.id),
              productId: String(r.product_id),
              productName: r.product || 'Bilinmiyor',
              rating: r.rating,
              sentiment,
              text: r.comment,
              tags,
              date: r.date,
              customer: r.customer,
            } as Review;
          });

        // Build ReviewProduct list from operations data
        const productReviewMap: Record<string, { ratings: number[]; count: number }> = {};
        for (const r of transformed) {
          if (!productReviewMap[r.productId]) productReviewMap[r.productId] = { ratings: [], count: 0 };
          productReviewMap[r.productId].ratings.push(r.rating);
          productReviewMap[r.productId].count++;
        }

        const builtProducts: ReviewProduct[] = rawProducts.map((p: any) => {
          const pid = String(p.id);
          const pData = productReviewMap[pid];
          const avgRating = pData
            ? +(pData.ratings.reduce((a: number, b: number) => a + b, 0) / pData.ratings.length).toFixed(1)
            : 0;
          return {
            id: pid,
            name: p.name,
            image: p.image,
            rating: avgRating,
            reviewCount: pData?.count ?? 0,
          };
        }).filter((p: ReviewProduct) => p.reviewCount > 0); // only products with reviews

        setAllReviews(transformed);
        setProducts(builtProducts);
      } catch (e) {
        console.error('[useYorumlarData] fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter by selected product
  const filteredReviews = selectedProductId
    ? allReviews.filter(r => r.productId === selectedProductId)
    : allReviews;

  // Analysis data
  const analysisData = buildAnalysisData(filteredReviews);

  // Stats
  const totalReviews = allReviews.length;
  const avgRating =
    totalReviews > 0
      ? +(allReviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
      : 0;
  const positiveCount = allReviews.filter(r => r.sentiment === 'positive').length;
  const positiveRatio = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0;
  const topProduct = [...products].sort((a, b) => b.reviewCount - a.reviewCount)[0] ?? null;

  return {
    products,
    reviews: filteredReviews,
    analysisData,
    selectedProductId,
    setSelectedProductId,
    loading,
    stats: {
      totalReviews,
      avgRating,
      positiveRatio,
      topProduct,
    },
  };
};
