
import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export const useFinansSummary = (period: string) => {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalExpense: 0,
    netProfit: 0,
    revenueExpenseData: [],
    recentTransactions: [],
    expenseBreakdown: []
  });

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const response = await api.getFinanceData(period);
        setData({
          totalRevenue: response.summary.totalIncome,
          totalExpense: response.summary.totalExpense,
          netProfit: response.summary.netProfit,
          revenueExpenseData: response.chartData.map((item: any) => ({
            name: item.name,
            gelir: item.income,
            gider: item.expense
          })),
          recentTransactions: response.recentTransactions.map((tx: any) => ({
            id: tx.id,
            icon: null, // React components will handle icon mapping
            title: tx.product ? `${tx.type} - ${tx.product}` : tx.type,
            time: tx.date,
            amount: tx.status === 'success' ? tx.amount : -tx.amount,
            rawType: tx.type
          })),
          expenseBreakdown: response.expenseBreakdown
        });
      } catch (err) {
        console.error("Finans verisi çekilirken hata:", err);
      }
    };
    fetchFinanceData();
  }, [period]);

  return data;
};
