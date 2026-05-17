import { useState } from 'react';
import { Stagger } from '../../../components/animation/Stagger';
import { Reveal } from '../../../components/animation/Reveal';
import { FileText, ArrowRight, X, AlertCircle, Loader2 } from 'lucide-react';
import { PresaleReportCard } from '../../../components/ui/PresaleReportCard';
import { api } from '../../../lib/api';
import type { Analysis } from '../hooks/useAnalysisHistory';

interface PastReportsProps {
  reports: Analysis[];
}

export const PastReports = ({ reports }: PastReportsProps) => {
  const [selectedReport, setSelectedReport] = useState<Analysis | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const handleOpenReport = async (report: Analysis) => {
    // Raporu zaten yüklüyse direkt aç
    if (report.report_json) {
      setSelectedReport(report);
      setModalError(null);
      return;
    }

    // report_json yoksa backend'den taze veri çek
    setSelectedReport(report);
    setModalLoading(true);
    setModalError(null);

    try {
      const fresh = await api.getAnalysis(report.id);
      setSelectedReport(fresh);
    } catch (err: any) {
      setModalError(err.message || 'Rapor yüklenemedi. Token süresi dolmuş olabilir, lütfen tekrar giriş yapın.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedReport(null);
    setModalError(null);
  };

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <FileText size={48} className="text-[var(--color-muted)] opacity-40" />
        <p className="text-[var(--color-muted)]">Henüz tamamlanmış analiz yok.</p>
        <p className="text-sm text-[var(--color-muted)] opacity-60">
          Satış Öncesi sayfasından yeni bir analiz başlatabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <>
      <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => {
          const date = new Date(report.created_at).toLocaleDateString('tr-TR');
          const isFailed = report.status === 'failed';

          return (
            <Reveal
              key={report.id}
              variant="fadeUp"
              className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col group hover:border-[var(--color-accent)]/50 transition-colors cursor-pointer"
              onClick={() => handleOpenReport(report)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg border border-[var(--color-border)] transition-colors ${
                  isFailed
                    ? 'text-red-400'
                    : 'text-[var(--color-muted)] group-hover:text-[var(--color-accent)]'
                }`}>
                  {isFailed ? <AlertCircle size={20} /> : <FileText size={20} />}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  isFailed
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-green-500/10 text-green-400'
                }`}>
                  {isFailed ? 'Başarısız' : 'Tamamlandı'}
                </span>
              </div>

              <h4 className="font-display font-medium text-[var(--color-fg)] text-lg mb-1 line-clamp-2">
                {report.product_name}
              </h4>
              <p className="text-sm text-[var(--color-muted)] mb-4">Pazar Analizi</p>

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-[var(--color-border)]">
                <span className="text-xs text-[var(--color-muted)]">{date}</span>
                <span className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-2)] transition-colors flex items-center font-medium">
                  Tam Rapor <ArrowRight size={16} className="ml-1" />
                </span>
              </div>
            </Reveal>
          );
        })}
      </Stagger>

      {/* Rapor Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="relative bg-[#121212] border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Kapat butonu */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Yükleniyor */}
            {modalLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={40} className="animate-spin text-white/40" />
                <p className="text-white/50 text-sm">Rapor yükleniyor...</p>
              </div>
            )}

            {/* Hata */}
            {modalError && !modalLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <AlertCircle size={40} className="text-red-400" />
                <p className="text-white font-semibold">Rapor Yüklenemedi</p>
                <p className="text-white/50 text-sm max-w-sm">{modalError}</p>
              </div>
            )}

            {/* Rapor içeriği */}
            {!modalLoading && !modalError && (
              selectedReport.report_json ? (
                <PresaleReportCard
                  productName={selectedReport.product_name}
                  reportContent={selectedReport.report_json}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <AlertCircle size={40} className="text-yellow-400" />
                  <p className="text-white font-semibold">Rapor İçeriği Bulunamadı</p>
                  <p className="text-white/50 text-sm">
                    Bu analize ait rapor verisi henüz oluşturulmamış veya kayıt sırasında bir sorun yaşandı.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};
