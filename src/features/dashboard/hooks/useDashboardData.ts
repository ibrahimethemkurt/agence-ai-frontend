import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export const useDashboardData = () => {
  const [data, setData] = useState({
    kpis: {
      totalRevenue: 0,
      activeProducts: 0,
      pendingAlerts: 0,
      completedAnalyses: 0
    },
    revenueData: {
      daily: [],
      weekly: [],
      monthly: [],
      yearly: [],
      allTime: []
    },
    growthTrend: [],
    activeAgents: [],
    activeProductsList: [],
    aiInsights: [],
    optimizationScore: 0,
    alerts: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await api.getDashboardData();
        setData(dashboardData);
      } catch (err) {
        console.error("Dashboard verisi çekilirken hata oluştu:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return { ...data, loading };
};
