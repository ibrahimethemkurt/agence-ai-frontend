import { useState } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { useAgentStatus } from '../features/analizler/hooks/useAgentStatus';
import { useAnalysisHistory } from '../features/analizler/hooks/useAnalysisHistory';
import { ActiveAgents } from '../features/analizler/components/ActiveAgents';
import { PastReports } from '../features/analizler/components/PastReports';

export const AnalizlerPage = () => {
  const [activeTab, setActiveTab] = useState<'aktif' | 'gecmis'>('aktif');
  const { agents } = useAgentStatus();
  const { reports } = useAnalysisHistory();

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--color-fg)] mb-2">Analizler & Ajanlar</h1>
          <p className="text-[var(--color-muted)]">Aktif çalışan ajanlarınızı ve geçmiş raporlarınızı inceleyin.</p>
        </div>
      </div>

      <div className="border-b border-[var(--color-border)] mb-6">
        <nav className="-mb-px flex space-x-8">
          <button 
            onClick={() => setActiveTab('aktif')}
            className={`${activeTab === 'aktif' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-border)]'} border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm transition-colors`}
          >
            Aktif Ajanlar ({agents.length})
          </button>
          <button 
            onClick={() => setActiveTab('gecmis')}
            className={`${activeTab === 'gecmis' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-border)]'} border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm transition-colors`}
          >
            Geçmiş Raporlar
          </button>
        </nav>
      </div>

      {activeTab === 'aktif' ? (
        <ActiveAgents agents={agents} />
      ) : (
        <PastReports reports={reports} onViewReport={(id) => console.log('View report', id)} />
      )}
      
    </PageTransition>
  );
};
