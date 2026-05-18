import React from 'react';
import { Reveal } from '../../../components/animation/Reveal';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useYorumlarData } from '../../satis-sonrasi/hooks/useYorumlarData';

const CARD = "bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl";

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

const PIE_COLORS = ['#10B981', '#EF4444'];

export const ReviewsSummaryDashboard = () => {
  const { products, stats, loading } = useYorumlarData();

  if (loading) {
    return (
      <Reveal variant="fadeUp" className="h-full">
        <div className={`${CARD} p-6 flex flex-col items-center justify-center min-h-[220px]`}>
          <div className="w-8 h-8 border-4 border-t-emerald-500 border-white/10 rounded-full animate-spin mb-4"></div>
          <p className="text-[var(--color-muted)] text-sm animate-pulse">Yorum özetleri yükleniyor...</p>
        </div>
      </Reveal>
    );
  }

  const pieData = [
    { name: 'Pozitif', value: stats.positiveRatio },
    { name: 'Negatif', value: 100 - stats.positiveRatio },
  ];

  const sortedProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount);

  return (
    <Reveal variant="fadeUp" className="h-full">
      <div className={`${CARD} p-6 h-full flex flex-col justify-center`}>
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

          {/* 2) Ortalama Puan */}
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

          {/* 3) Yorum Dağılımı */}
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
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
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

          {/* 4) En Çok Yorum Alan */}
          <div className="pl-0 lg:pl-5 py-4 lg:py-0">
            <p className="text-sm font-medium text-[var(--color-fg)] mb-3">En Çok Yorum Alan</p>
            <div className="space-y-3">
              {sortedProducts.slice(0, 4).map((p, i) => {
                const maxCount = sortedProducts[0]?.reviewCount || 1;
                const barWidth = Math.max(10, Math.round((p.reviewCount / maxCount) * 100));
                const barColors = [
                  'from-amber-500/60 to-amber-400/30',
                  'from-[var(--color-accent)]/50 to-[var(--color-accent)]/20',
                  'from-emerald-500/40 to-emerald-500/15',
                  'from-sky-500/40 to-sky-500/15',
                ];
                const textColors = ['text-amber-400', 'text-[var(--color-accent)]', 'text-emerald-400', 'text-sky-400'];
                return (
                  <div key={p.id} className="relative w-full h-6 flex items-center rounded-md overflow-hidden bg-white/5 border border-white/5">
                    <div 
                      className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${barColors[i % barColors.length]}`} 
                      style={{ width: `${barWidth}%` }} 
                    />
                    <div className="relative z-10 w-full px-2 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5 truncate max-w-[80%]">
                        <span className={`font-mono font-bold ${textColors[i % textColors.length]}`}>{i + 1}</span>
                        <span className="text-[var(--color-fg)] truncate" title={p.name}>{p.name}</span>
                      </div>
                      <span className="text-[var(--color-muted)] font-medium pl-2">{p.reviewCount}</span>
                    </div>
                  </div>
                );
              })}
              {sortedProducts.length === 0 && (
                <p className="text-xs text-[var(--color-muted)]">Henüz yorum yok.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </Reveal>
  );
};
