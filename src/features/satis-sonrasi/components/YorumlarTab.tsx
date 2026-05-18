import { useState } from 'react';
import { Reveal } from '../../../components/animation/Reveal';
import { Radio } from '../../../components/radio';
import {
  MessageSquareText, Star, Filter,
  SmilePlus, Frown, ChevronDown, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';
import { useYorumlarData } from '../hooks/useYorumlarData';
import type { Review } from '../hooks/useYorumlarData';

// --- Glassmorphism card class ---
const CARD = "bg-[#0A0A0A]/70 backdrop-blur-sm border border-[var(--color-border)] rounded-xl";

// --- STAR RATING ---
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-[#333]'}`} />
    ))}
  </div>
);

// --- REVIEW CARD ---
const ReviewCard = ({ review, index }: { review: Review; index: number }) => (
  <div className="border-b border-[var(--color-border)] last:border-b-0 py-4 first:pt-0">
    <div className="flex items-start gap-3">
      <span className="text-xs text-[var(--color-muted)] font-mono mt-0.5 min-w-[18px]">{index + 1}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs font-bold tracking-wider ${review.sentiment === 'positive' ? 'text-emerald-400' : 'text-red-400'}`}>
            {review.sentiment === 'positive' ? 'POZİTİF' : 'NEGATİF'}
          </span>
          <StarRating rating={review.rating} />
        </div>
        <p className="text-sm text-[var(--color-fg)] leading-relaxed mb-2">{review.text}</p>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {review.tags.map((tag, ti) => (
            <span key={ti} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${tag.sentiment === 'positive'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-red-500/30 bg-red-500/10 text-red-400'
              }`}>
              {tag.sentiment === 'positive' ? <SmilePlus className="w-3 h-3" /> : <Frown className="w-3 h-3" />}
              {tag.label}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--color-muted)]">{review.date}</span>
          <span className="text-xs text-[var(--color-muted)] truncate max-w-[140px]">{review.productName}</span>
        </div>
      </div>
    </div>
  </div>
);

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#0A0A0A] border border-[#2a2a2a] rounded-lg p-3 shadow-xl text-xs">
      <p className="text-[var(--color-fg)] font-semibold mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.fill || entry.color }} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.fill || entry.color }} />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

// --- Rating trend mini data ---
const RATING_TREND = [
  { month: 'Oca', puan: 3.2 },
  { month: 'Şub', puan: 3.5 },
  { month: 'Mar', puan: 3.4 },
  { month: 'Nis', puan: 3.8 },
  { month: 'May', puan: 3.6 },
  { month: 'Haz', puan: 3.9 },
  { month: 'Tem', puan: 3.7 },
  { month: 'Ağu', puan: 4.0 },
  { month: 'Eyl', puan: 3.8 },
  { month: 'Eki', puan: 4.2 },
  { month: 'Kas', puan: 4.0 },
  { month: 'Ara', puan: 4.1 },
];

// --- PIE COLORS ---
const PIE_COLORS = ['#10B981', '#EF4444'];

// --- MAIN COMPONENT ---
export const YorumlarTab = () => {
  const {
    products, reviews, analysisData,
    selectedProductId, setSelectedProductId, stats, loading
  } = useYorumlarData();

  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredBysentiment = sentimentFilter === 'all'
    ? reviews
    : reviews.filter(r => r.sentiment === sentimentFilter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <div className="w-10 h-10 border-4 border-t-emerald-500 border-white/10 rounded-full animate-spin"></div>
        <p className="text-[var(--color-muted)] font-medium animate-pulse">Yorumlar yükleniyor...</p>
      </div>
    );
  }

  const pieData = [
    { name: 'Pozitif', value: stats.positiveRatio },
    { name: 'Negatif', value: 100 - stats.positiveRatio },
  ];

  const sortedProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount);

  return (
    <div className="space-y-6">

      {/* ═══════════ DASHBOARD — SINGLE ROW CARD ═══════════ */}
      <Reveal variant="fadeUp">
        <div className={`${CARD} p-6`}>
          <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1fr_1fr_1.3fr] gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-border)]">

            {/* 1) Toplam Yorum */}
            <div className="pr-0 lg:pr-5 py-4 lg:py-0">
              <p className="text-sm font-medium text-[var(--color-fg)] mb-2">Toplam Yorum</p>
              <p className="text-3xl font-bold text-[var(--color-fg)] mb-2">{stats.totalReviews.toLocaleString('tr-TR')}</p>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[var(--color-muted)]">Bu hafta</span>
                <span className="text-emerald-400 font-medium">+127</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-emerald-400" style={{ width: '68%' }} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[var(--color-muted)] mt-1">
                <span>Geçen hafta: 94</span>
                <span className="text-emerald-400">↑ 35%</span>
              </div>
            </div>

            {/* 2) Ortalama Puan — Sparkline */}
            <div className="px-0 lg:px-5 py-4 lg:py-0">
              <p className="text-sm font-medium text-[var(--color-fg)] mb-2">Ortalama Puan</p>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-3xl font-bold text-[var(--color-fg)]">{stats.avgRating}<span className="text-base text-[var(--color-muted)] font-normal">/5</span></p>
                <div className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-medium">+0.3</span>
                </div>
              </div>
              <div style={{ width: '90%', height: 64 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={RATING_TREND} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A07CFE" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#A07CFE" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" hide />
                    <YAxis domain={[2.8, 4.5]} hide />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="bg-[#0A0A0A] border border-[#2a2a2a] rounded-md px-2 py-1 text-[10px] shadow-lg">
                            <span className="text-[var(--color-fg)] font-semibold">{payload[0].payload.month}:</span>{' '}
                            <span className="text-[#A07CFE] font-bold">{payload[0].value}</span>
                          </div>
                        );
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="puan"
                      stroke="#A07CFE"
                      fill="url(#ratingGrad)"
                      strokeWidth={2}
                      dot={{ r: 2, fill: '#A07CFE', strokeWidth: 0 }}
                      activeDot={{ r: 4, fill: '#A07CFE', stroke: '#1a1a1a', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="px-0 lg:px-5 py-4 lg:py-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[var(--color-fg)]">Yorum Dağılımı</p>
              </div>
              <div className="flex items-center justify-center" style={{ height: 130 }}>
                <ResponsiveContainer width={150} height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={62}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      strokeWidth={2}
                      stroke="#0A0A0A"
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-(midAngle || 0) * RADIAN);
                        const y = cy + radius * Math.sin(-(midAngle || 0) * RADIAN);
                        const labelText = index === 0 ? "Pozitif" : "Negatif";
                        return (
                          <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontWeight={700}>
                            <tspan x={x} dy="-0.6em" fontSize={10}>{labelText}</tspan>
                            <tspan x={x} dy="1.2em" fontSize={13}>%{value}</tspan>
                          </text>
                        );
                      }}
                      labelLine={false}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4) En Çok Yorum Alan — Bar List */}
            <div className="pl-0 lg:pl-5 py-4 lg:py-0">
              <p className="text-sm font-medium text-[var(--color-fg)] mb-3">En Çok Yorum Alan</p>
              <div className="space-y-3">
                {sortedProducts.slice(0, 4).map((p, i) => {
                  const maxCount = sortedProducts[0].reviewCount;
                  const barWidth = Math.round((p.reviewCount / maxCount) * 100);
                  const barColors = [
                    'from-amber-500/60 to-amber-400/30',
                    'from-[var(--color-accent)]/50 to-[var(--color-accent)]/20',
                    'from-emerald-500/40 to-emerald-500/15',
                    'from-sky-500/40 to-sky-500/15',
                  ];
                  return (
                    <div key={p.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-[10px] font-bold w-4 h-4 rounded flex items-center justify-center shrink-0 ${i === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-[var(--color-muted)]'
                            }`}>{i + 1}</span>
                          <span className="text-xs text-[var(--color-fg)] truncate">{p.name}</span>
                        </div>
                        <span className="text-xs text-[var(--color-muted)] shrink-0 tabular-nums ml-2">{p.reviewCount}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${barColors[i]}`}
                          style={{ width: `${barWidth}%`, transition: 'width 0.6s ease' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </Reveal>

      {/* ═══════════ MAIN 3 COLUMN GRID ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-6">

        {/* LEFT: Products */}
        <Reveal variant="fadeUp" delay={0.1}>
          <div className={`${CARD} p-4 lg:max-h-[600px] overflow-y-auto`}>
            <h3 className="text-sm font-semibold text-[var(--color-fg)] mb-4 tracking-wide">Ürünler</h3>
            <div className="space-y-1">
              {/* All Products Option */}
              <button
                onClick={() => setSelectedProductId(null)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${selectedProductId === null ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'hover:bg-white/[0.03] border border-transparent'
                  }`}
              >
                <div className="pointer-events-none"><Radio checked={selectedProductId === null} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-fg)] truncate">Tüm Ürünler</p>
                  <p className="text-xs text-[var(--color-muted)]">{stats.totalReviews.toLocaleString('tr-TR')} yorum</p>
                </div>
              </button>
              {/* Individual Products */}
              {products.map(product => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${selectedProductId === product.id ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'hover:bg-white/[0.03] border border-transparent'
                    }`}
                >
                  <div className="pointer-events-none"><Radio checked={selectedProductId === product.id} /></div>
                  <img src={product.image} alt={product.name} className="w-9 h-9 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-fg)] truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-yellow-400 font-medium">{product.rating}</span>
                      </div>
                      <span className="text-xs text-[var(--color-muted)]">·</span>
                      <span className="text-xs text-[var(--color-muted)]">{product.reviewCount} yorum</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* CENTER: Review Analysis Chart */}
        <Reveal variant="fadeUp" delay={0.2}>
          <div className={`${CARD} p-5`}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-[var(--color-fg)] tracking-wide">Yorum Analizi</h3>
              <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Olumlu</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" /> Olumsuz</span>
              </div>
            </div>
            {selectedProductId && (
              <p className="text-xs text-[var(--color-accent)] mb-2">
                {products.find(p => p.id === selectedProductId)?.name}
              </p>
            )}
            {!selectedProductId && (
              <p className="text-xs text-[var(--color-muted)] mb-2">Tüm ürünlerin genel analizi</p>
            )}
            <div style={{ width: '100%', height: 420 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: '#737373', fontSize: 11 }}
                    axisLine={{ stroke: '#1a1a1a' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#737373', fontSize: 11 }}
                    axisLine={{ stroke: '#1a1a1a' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="positive" name="Olumlu" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="negative" name="Olumsuz" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>

        {/* RIGHT: Reviews List */}
        <Reveal variant="fadeUp" delay={0.3}>
          <div className={`${CARD} p-5 max-h-[540px] flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[var(--color-fg)] tracking-wide">
                Yorumlar
                <span className="ml-2 text-xs font-normal text-[var(--color-muted)]">({filteredBysentiment.length})</span>
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${sentimentFilter !== 'all'
                      ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                      : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:bg-white/[0.03]'
                    }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {sentimentFilter === 'all' ? 'Filtre' : sentimentFilter === 'positive' ? 'Pozitif' : 'Negatif'}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showFilterMenu && (
                  <div className="absolute right-0 top-full mt-1 z-10 bg-[#0A0A0A] border border-[#2a2a2a] rounded-lg shadow-xl p-1 min-w-[130px]">
                    {(['all', 'positive', 'negative'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => { setSentimentFilter(f); setShowFilterMenu(false); }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${sentimentFilter === f ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'text-[var(--color-fg)] hover:bg-white/[0.03]'
                          }`}
                      >
                        {f === 'all' ? 'Tümü' : f === 'positive' ? '🟢 Pozitif' : '🔴 Negatif'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 space-y-0">
              {filteredBysentiment.length > 0 ? (
                filteredBysentiment.map((review, i) => (
                  <ReviewCard key={review.id} review={review} index={i} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-[var(--color-muted)]">
                  <MessageSquareText className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm">Bu filtrede yorum bulunamadı.</p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
