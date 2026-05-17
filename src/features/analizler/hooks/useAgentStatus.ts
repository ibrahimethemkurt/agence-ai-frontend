import { useAnalysisHistory } from './useAnalysisHistory';

// Aktif ajanları history hook'undan türet — ayrı mock veriye gerek yok
export const useAgentStatus = () => {
  const { activeAgents, loading } = useAnalysisHistory();

  const agents = activeAgents.map(a => ({
    id: String(a.id),
    product: a.product_name,
    type: 'Pazar Analizi',
    status: a.status === 'processing' ? 'aktif' : 'bekliyor',
    startTime: new Date(a.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    progress: a.status === 'processing' ? 60 : 10,
  }));

  return { agents, loading };
};
