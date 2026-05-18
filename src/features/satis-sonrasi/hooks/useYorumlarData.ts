import { useState, useEffect, useMemo } from 'react';
import { api } from '../../../lib/api';

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

export const useYorumlarData = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<ReviewProduct[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reviewsData, listingsData] = await Promise.all([
          api.getSupportReviews(),
          api.getListings()
        ]);

        const listingImageMap = new Map<string, string>();
        listingsData.forEach((l: any) => {
          // Fallback image logic based on product name match or direct link if possible
          listingImageMap.set(l.product_name, l.processed_photo_url || l.photo_url || '');
        });

        const productMap = new Map<string, ReviewProduct & { totalRating: number }>();
        
        const formattedReviews: Review[] = reviewsData.map((r: any) => {
          const isPositive = r.rating >= 4;
          const sentiment = isPositive ? 'positive' : 'negative';
          
          if (!productMap.has(String(r.product_id))) {
            const defaultImage = listingImageMap.get(r.product) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80';
            productMap.set(String(r.product_id), {
              id: String(r.product_id),
              name: r.product,
              image: defaultImage,
              rating: 0,
              reviewCount: 0,
              totalRating: 0
            });
          }
          
          const p = productMap.get(String(r.product_id))!;
          p.reviewCount += 1;
          p.totalRating += r.rating;

          // Simple mock tags based on rating
          const tags: ReviewTag[] = [];
          if (r.rating === 5) tags.push({ label: 'KALİTE', sentiment: 'positive' });
          if (r.rating <= 2) tags.push({ label: 'ŞİKAYET', sentiment: 'negative' });
          if (r.comment && r.comment.toLowerCase().includes('kargo')) tags.push({ label: 'KARGO', sentiment: r.rating >= 3 ? 'positive' : 'negative' });

          return {
            id: String(r.id),
            productId: String(r.product_id),
            productName: r.product,
            rating: r.rating,
            sentiment: sentiment,
            text: r.comment,
            tags: tags,
            date: r.date
          };
        });

        const finalProducts: ReviewProduct[] = Array.from(productMap.values()).map(p => ({
          id: p.id,
          name: p.name,
          image: p.image,
          reviewCount: p.reviewCount,
          rating: +(p.totalRating / p.reviewCount).toFixed(1)
        }));

        setAllReviews(formattedReviews);
        setProducts(finalProducts);
      } catch (e) {
        console.error("Yorumlar yüklenirken hata:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredReviews = selectedProductId
    ? allReviews.filter(r => r.productId === selectedProductId)
    : allReviews;

  const totalReviews = products.reduce((sum, p) => sum + p.reviewCount, 0);
  const avgRating = totalReviews > 0 ? +(products.reduce((sum, p) => sum + p.rating * p.reviewCount, 0) / totalReviews).toFixed(1) : 0;
  const positiveCount = allReviews.filter(r => r.sentiment === 'positive').length;
  const positiveRatio = allReviews.length > 0 ? Math.round((positiveCount / allReviews.length) * 100) : 0;
  const topProduct = products.length > 0 ? [...products].sort((a, b) => b.reviewCount - a.reviewCount)[0] : null;

  // Generate dynamic analysis data
  const analysisData = useMemo(() => {
    const data: AnalysisMetric[] = [
      { category: 'Ürün', positive: 0, negative: 0 },
      { category: 'Kargo', positive: 0, negative: 0 },
      { category: 'Fiyat', positive: 0, negative: 0 },
      { category: 'Kalite', positive: 0, negative: 0 },
    ];
    
    filteredReviews.forEach(r => {
      const text = r.text.toLowerCase();
      const isPos = r.sentiment === 'positive';
      
      if (text.includes('kargo') || text.includes('teslimat') || text.includes('geldi')) {
         isPos ? data[1].positive++ : data[1].negative++;
      }
      if (text.includes('fiyat') || text.includes('pahalı') || text.includes('ucuz')) {
         isPos ? data[2].positive++ : data[2].negative++;
      }
      if (text.includes('kalite') || text.includes('malzeme') || text.includes('sağlam')) {
         isPos ? data[3].positive++ : data[3].negative++;
      }
      // Genel ürün sayacı
      isPos ? data[0].positive++ : data[0].negative++;
    });
    return data;
  }, [filteredReviews]);

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

