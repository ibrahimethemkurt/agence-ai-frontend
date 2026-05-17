import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export type Analysis = {
  id: number;
  product_name: string;
  status: string;
  created_at: string;
  report_json: string | null;
  inputs_json: string | null;
};

export const useAnalysisHistory = () => {
  const [reports, setReports] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = async () => {
    try {
      const data = await api.getUserAnalyses();
      setReports(data);
    } catch (err: any) {
      setError(err.message || 'Analizler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
    // Her 15 saniyede bir yenile (uzun süren analizler tamamlanınca görünsün)
    const interval = setInterval(fetchAnalyses, 15000);
    return () => clearInterval(interval);
  }, []);

  const completedReports = reports.filter(r => r.status === 'completed');
  const activeAgents = reports.filter(r => r.status === 'bekliyor' || r.status === 'processing');

  return { reports, completedReports, activeAgents, loading, error, refetch: fetchAnalyses };
};
