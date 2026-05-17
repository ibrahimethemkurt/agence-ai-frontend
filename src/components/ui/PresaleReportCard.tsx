import { FileText, AlertCircle, TrendingDown, TrendingUp, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PresaleReportCardProps {
  productName: string;
  reportContent: string;
  onSave?: () => void;
}

// Sıfır bağımlılıklı basit Markdown → JSX dönüştürücü
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ## Başlık (H2)
    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={key++}
          className="flex items-center gap-2 text-base font-bold text-white mt-8 mb-3 first:mt-0 pb-2 border-b border-white/10"
        >
          <span className="w-1 h-5 rounded-full bg-purple-500 shrink-0 inline-block" />
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // ### Başlık (H3)
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-sm font-semibold text-white/90 mt-4 mb-2">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // - veya * madde
    if (line.match(/^[-*]\s+/)) {
      // Ardışık maddeleri birlikte topla
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
        listItems.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={key++} className="space-y-2 mb-4 ml-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-white/75 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numaralı liste (1. 2. ...)
    if (line.match(/^\d+\.\s+/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        listItems.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={key++} className="space-y-2 mb-4 ml-1 list-decimal list-inside">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-sm text-white/75 leading-relaxed pl-1">
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Boş satır
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Normal paragraf
    elements.push(
      <p
        key={key++}
        className="text-sm text-white/75 leading-relaxed mb-3"
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
    i++;
  }

  return elements;
}

// **kalın**, *italik*, `kod` inline formatları
function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-purple-300 font-medium not-italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-white/10 text-purple-300 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
}

// Eski JSON formatını güzel bir kart olarak render et
function renderJsonReport(json: Record<string, any>) {
  const rakip = json.rakip_fiyatlari || {};
  const kar = json.hesaplanan_kar_marji_yuzdesi;
  const fiyat = json.onerilen_satis_fiyati;
  const isPositive = kar >= 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
          <p className="text-xs text-white/40 mb-1">En Düşük Rakip</p>
          <p className="text-lg font-bold text-white">{rakip.en_dusuk?.toFixed(2)} ₺</p>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
          <p className="text-xs text-white/40 mb-1">Ortalama Rakip</p>
          <p className="text-lg font-bold text-white">{rakip.ortalama?.toFixed(2)} ₺</p>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
          <p className="text-xs text-white/40 mb-1">En Yüksek Rakip</p>
          <p className="text-lg font-bold text-white">{rakip.en_yuksek?.toFixed(2)} ₺</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl border p-4 flex items-center gap-3 ${
          isPositive ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
        }`}>
          {isPositive ? <TrendingUp size={20} className="text-green-400" /> : <TrendingDown size={20} className="text-red-400" />}
          <div>
            <p className="text-xs text-white/40">Hesaplanan Kar Marjı</p>
            <p className={`text-xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {kar > 0 ? '+' : ''}{kar?.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-4 flex items-center gap-3">
          <Tag size={20} className="text-purple-400" />
          <div>
            <p className="text-xs text-white/40">Önerilen Satış Fiyatı</p>
            <p className="text-xl font-bold text-purple-300">{fiyat?.toFixed(2)} ₺</p>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
        <p className="text-xs text-white/40 mb-2">Ham Veri</p>
        <pre className="text-xs text-white/50 overflow-x-auto">{JSON.stringify(json, null, 2)}</pre>
      </div>
    </div>
  );
}

export function PresaleReportCard({ productName, reportContent, onSave }: PresaleReportCardProps) {
  const navigate = useNavigate();

  const isFailed = reportContent?.startsWith('## Analiz Başarısız');
  const isEmpty = !reportContent || reportContent.trim().length === 0;

  // Eski JSON formatı mı, yeni Markdown formatı mı?
  let parsedJson: Record<string, any> | null = null;
  if (reportContent && reportContent.trim().startsWith('{')) {
    try {
      parsedJson = JSON.parse(reportContent);
    } catch {
      parsedJson = null;
    }
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <AlertCircle size={48} className="text-yellow-400" />
        <p className="text-white/60">Rapor içeriği yüklenemedi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
            <FileText size={20} className="text-white/60" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-0.5">
              Pazar Analizi Raporu
            </p>
            <h3 className="text-xl font-bold text-white leading-tight">{productName}</h3>
          </div>
        </div>
        <span
          className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full border ${
            isFailed
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : 'bg-green-500/10 text-green-400 border-green-500/20'
          }`}
        >
          {isFailed ? 'Başarısız' : 'Tamamlandı'}
        </span>
      </div>

      {/* Rapor İçeriği */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 md:p-8">
        {parsedJson ? renderJsonReport(parsedJson) : renderMarkdown(reportContent)}
      </div>

      {/* Aksiyon Butonları */}
      <div className="flex gap-3 pt-2">
        {onSave && (
          <button
            onClick={onSave}
            className="border border-white/10 text-white/70 rounded-2xl px-6 py-3 font-medium hover:bg-white/5 transition-colors text-sm"
          >
            Kaydet
          </button>
        )}
        <button
          onClick={() => navigate('/ajanlar/satis-sureci')}
          className="flex-1 bg-white text-black rounded-2xl px-8 py-3 font-bold hover:bg-white/90 transition-colors text-sm"
        >
          Satışa Geç →
        </button>
      </div>
    </div>
  );
}
