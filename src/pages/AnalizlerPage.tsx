import { useState } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { useAnalysisHistory } from '../features/analizler/hooks/useAnalysisHistory';
import { ActiveAgents } from '../features/analizler/components/ActiveAgents';
import { PastReports } from '../features/analizler/components/PastReports';
import { Loader2, AlertCircle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export const AnalizlerPage = () => {
  const [activeTab, setActiveTab] = useState<'aktif' | 'gecmis'>('gecmis');
  const navigate = useNavigate();
  const { completedReports, activeAgents, loading, error } = useAnalysisHistory();

  // activeAgents'ı ActiveAgents bileşeninin beklediği formata dönüştür
  const agentsFormatted = activeAgents.map(a => ({
    id: String(a.id),
    product: a.product_name,
    type: 'Pazar Analizi',
    status: a.status === 'processing' ? 'aktif' : 'bekliyor',
    startTime: new Date(a.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    progress: a.status === 'processing' ? 60 : 10,
  }));

  const isAuthError = !api.isLoggedIn() || (!!error && (error.includes('401') || error.includes('alınamadı')));

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
            Aktif Ajanlar ({agentsFormatted.length})
          </button>
          <button
            onClick={() => setActiveTab('gecmis')}
            className={`${activeTab === 'gecmis' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-border)]'} border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm transition-colors`}
          >
            Geçmiş Raporlar ({completedReports.length})
          </button>
        </nav>
      </div>

      {/* Yükleniyor */}
      {loading && (
        <div className="flex items-center justify-center py-12 gap-3 text-[var(--color-muted)]">
          <Loader2 size={20} className="animate-spin" />
          <span>Analizler yükleniyor...</span>
        </div>
      )}

      {/* Auth Hatası */}
      {!loading && isAuthError && (
        <div className="flex flex-col items-center justify-center py-16 gap-5">
          <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
            <AlertCircle size={32} className="text-yellow-400" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold mb-1">Oturum Süresi Dolmuş</p>
            <p className="text-[var(--color-muted)] text-sm">Analizlerinizi görmek için tekrar giriş yapmanız gerekiyor.</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 bg-white text-black rounded-2xl px-6 py-3 font-bold hover:bg-white/90 transition-colors"
          >
            <LogIn size={18} />
            Giriş Yap
          </button>
        </div>
      )}

      {/* Genel Hata */}
      {!loading && error && !isAuthError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error} — Backend sunucusunun çalıştığından emin olun.
        </div>
      )}

      {/* İçerik */}
      {!loading && !error && (
        <>
          {activeTab === 'aktif' ? (
            <ActiveAgents agents={agentsFormatted} />
          ) : (
            <PastReports reports={completedReports} />
          )}
        </>
      )}
    </PageTransition>
  );
};
