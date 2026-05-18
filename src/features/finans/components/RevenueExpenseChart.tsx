import { Reveal } from '../../../components/animation/Reveal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueExpenseChartProps {
  data: Array<{ name: string; gelir: number; gider: number }>;
}

const formatYAxis = (value: number) => {
  if (value === 0) return '₺0';
  return `₺${new Intl.NumberFormat('tr-TR', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`;
};

const formatTooltip = (value: unknown) => {
  const num = typeof value === 'number' ? value : Number(value);
  return `₺${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)}`;
};

export const RevenueExpenseChart = ({ data }: RevenueExpenseChartProps) => {
  return (
    <Reveal variant="fadeUp" className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] h-[400px]">
      <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-6">Gelir / Gider Karşılaştırması</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 60 }}>
            <defs>
              <linearGradient id="colorGelir" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGider" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#737373"
              tick={{ fill: '#737373', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickMargin={12}
            />
            <YAxis
              stroke="#737373"
              tick={{ fill: '#737373', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatYAxis}
              tickMargin={8}
              width={55}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#121212', borderColor: '#2a2a2a', color: '#ffffff', borderRadius: '12px' }}
              itemStyle={{ color: '#ffffff' }}
              formatter={formatTooltip}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            <Area
              type="monotone"
              dataKey="gelir"
              name="Gelir"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGelir)"
              dot={false}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="gider"
              name="Gider"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGider)"
              dot={false}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Reveal>
  );
};
