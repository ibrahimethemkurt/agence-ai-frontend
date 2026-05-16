// TODO: Replace with real apiFetch call when backend is ready
export const useDashboardData = () => {
  return {
    kpis: {
      totalRevenue: 12400,
      activeProducts: 142,
      pendingAlerts: 3,
      completedAnalyses: 15
    },
    revenueData: {
      daily: [
        { name: 'Pzt', income: 450, expense: 300 },
        { name: 'Sal', income: 520, expense: 280 },
        { name: 'Çar', income: 610, expense: 350 },
        { name: 'Per', income: 580, expense: 400 },
        { name: 'Cum', income: 750, expense: 410 },
        { name: 'Cmt', income: 900, expense: 500 },
        { name: 'Paz', income: 820, expense: 450 },
      ],
      weekly: [
        { name: 'Hafta 1', income: 1500, expense: 900 },
        { name: 'Hafta 2', income: 2100, expense: 1100 },
        { name: 'Hafta 3', income: 1800, expense: 1000 },
        { name: 'Hafta 4', income: 2400, expense: 1200 },
      ],
      monthly: [
        { name: 'Oca', income: 4000, expense: 2400 },
        { name: 'Şub', income: 3000, expense: 1398 },
        { name: 'Mar', income: 2000, expense: 9800 },
        { name: 'Nis', income: 2780, expense: 3908 },
        { name: 'May', income: 1890, expense: 4800 },
        { name: 'Haz', income: 2390, expense: 3800 },
        { name: 'Tem', income: 3490, expense: 4300 },
      ],
      yearly: [
        { name: '2023', income: 32000, expense: 21000 },
        { name: '2024', income: 45000, expense: 28000 },
        { name: '2025', income: 58000, expense: 34000 },
        { name: '2026', income: 72000, expense: 41000 },
      ],
      allTime: [
        { name: '2021', income: 15000, expense: 10000 },
        { name: '2022', income: 24000, expense: 16000 },
        { name: '2023', income: 32000, expense: 21000 },
        { name: '2024', income: 45000, expense: 28000 },
        { name: '2025', income: 58000, expense: 34000 },
        { name: '2026', income: 72000, expense: 41000 },
      ]
    },
    growthTrend: [
      { name: 'Oca', growth: 12 },
      { name: 'Şub', growth: 18 },
      { name: 'Mar', growth: 24 },
      { name: 'Nis', growth: 35 },
      { name: 'May', growth: 42 },
      { name: 'Haz', growth: 55 },
      { name: 'Tem', growth: 76 },
    ],
    activeAgents: [
      { id: '1', name: 'Pazar Analizi Ajanı', status: 'active', task: 'Rakip e-ticaret sitelerinden fiyat verisi toplanıyor...' },
      { id: '2', name: 'Kampanya Optimizatörü', status: 'active', task: 'Google Ads kampanyaları bütçe optimizasyonu yapılıyor.' },
      { id: '3', name: 'Sosyal Medya Ajanı', status: 'idle', task: 'Beklemede' },
      { id: '4', name: 'Stok Tahmin Ajanı', status: 'processing', task: 'Gelecek ayın stok ihtiyaç analizi hesaplanıyor...' },
    ],
    activeProductsList: [
      { id: '1', name: 'Oyuncu Mouse', status: 'Stokta', stock: 145 },
      { id: '2', name: 'Mekanik Klavye', status: 'Kritik Stok', stock: 12 },
      { id: '3', name: 'Gaming Kulaklık', status: 'Tükendi', stock: 0 },
      { id: '4', name: '4K Monitör', status: 'Stokta', stock: 34 },
      { id: '5', name: 'RGB Mousepad', status: 'Stokta', stock: 210 },
      { id: '6', name: 'Oyuncu Koltuğu', status: 'Kritik Stok', stock: 5 },
    ],
    aiInsights: [
      { id: '1', title: 'Fiyatlandırma Fırsatı', description: 'Mekanik Klavye için rakip fiyatları %5 arttı. Kâr marjınızı artırmak için fiyatı güncelleyebilirsiniz.', type: 'positive' },
      { id: '2', title: 'Stok Uyarısı', description: 'Oyuncu Koltuğu stoku kritik seviyede (5 adet kaldı). Tahmini 2 gün içinde tükenecek.', type: 'warning' },
      { id: '3', title: 'Kampanya Önerisi', description: '4K Monitör görüntülemeleri %40 arttı ancak dönüşüm düşük. %5 indirim kuponu tanımlamanız önerilir.', type: 'info' }
    ],
    optimizationScore: 92,
    recentAnalyses: [
      { id: '1', product: 'Kablosuz Kulaklık', type: 'Pazar Analizi', date: '2026-05-14' },
      { id: '2', product: 'Mekanik Klavye', type: 'Fiyat Analizi', date: '2026-05-13' },
      { id: '3', product: 'Oyuncu Mouse', type: 'Pazar Analizi', date: '2026-05-12' },
    ],
    alerts: []
  };
};
