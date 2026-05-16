// TODO: Replace with real apiFetch call when backend is ready
export const useDashboardData = () => {
  return {
    kpis: {
      totalRevenue: 12400,
      activeProducts: 8,
      pendingAlerts: 3,
      completedAnalyses: 15
    },
    revenueData: [
      { name: 'Oca', value: 4000 },
      { name: 'Şub', value: 3000 },
      { name: 'Mar', value: 2000 },
      { name: 'Nis', value: 2780 },
      { name: 'May', value: 1890 },
      { name: 'Haz', value: 2390 },
      { name: 'Tem', value: 3490 },
    ],
    recentAnalyses: [
      { id: '1', product: 'Kablosuz Kulaklık', type: 'Pazar Analizi', date: '2026-05-14' },
      { id: '2', product: 'Mekanik Klavye', type: 'Fiyat Analizi', date: '2026-05-13' },
      { id: '3', product: 'Oyuncu Mouse', type: 'Pazar Analizi', date: '2026-05-12' },
    ],
    alerts: []
  };
};
