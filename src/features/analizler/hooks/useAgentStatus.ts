import { useState, useEffect } from 'react';

export const useAgentStatus = () => {
  const [agents, setAgents] = useState([
    { id: '1', product: 'Kablosuz Kulaklık V2', type: 'Pazar Analizi', status: 'bekliyor', startTime: '10:45', progress: 45 },
    { id: '2', product: 'Oyuncu Monitörü', type: 'Fiyat Analizi', status: 'aktif', startTime: '10:30', progress: 85 },
  ]);

  // Mock polling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'aktif' && agent.progress < 100) {
          return { ...agent, progress: agent.progress + 5 };
        }
        if (agent.progress >= 100 && agent.status !== 'tamamlandı') {
          return { ...agent, status: 'tamamlandı' };
        }
        return agent;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return { agents };
};
