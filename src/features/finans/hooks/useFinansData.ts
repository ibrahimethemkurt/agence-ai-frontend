
export const useFinansSummary = (period: string) => {
  // Mock data based on period
  return {
    totalRevenue: period === 'Aylık' ? 24500 : period === 'Haftalık' ? 5200 : 850,
    totalExpense: period === 'Aylık' ? 12300 : period === 'Haftalık' ? 2100 : 300,
    netProfit: period === 'Aylık' ? 12200 : period === 'Haftalık' ? 3100 : 550,
    revenueExpenseData: [
      { name: 'Pzt', gelir: 4000, gider: 2400 },
      { name: 'Sal', gelir: 3000, gider: 1398 },
      { name: 'Çar', gelir: 2000, gider: 9800 },
      { name: 'Per', gelir: 2780, gider: 3908 },
      { name: 'Cum', gelir: 1890, gider: 4800 },
      { name: 'Cmt', gelir: 2390, gider: 3800 },
      { name: 'Paz', gelir: 3490, gider: 4300 },
    ]
  };
};

export const useExpenses = () => {
  return [
    { id: '1', date: '2026-05-14', category: 'Kargo', description: 'Aras Kargo Gönderimleri', amount: 450, isRecurring: true },
    { id: '2', date: '2026-05-12', category: 'Platform Komisyonu', description: 'Trendyol Komisyon', amount: 1200, isRecurring: false },
    { id: '3', date: '2026-05-10', category: 'Reklam', description: 'Instagram Ads', amount: 3000, isRecurring: true },
  ];
};
