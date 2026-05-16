import { Reveal } from '../../../components/animation/Reveal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueExpenseChartProps {
  data: Array<{ name: string; gelir: number; gider: number }>;
}

export const RevenueExpenseChart = ({ data }: RevenueExpenseChartProps) => {
  return (
    <Reveal variant="fadeUp" className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] h-[400px]">
      <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-6">Gelir / Gider Karşılaştırması</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
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
            <XAxis dataKey="name" stroke="#737373" tick={{ fill: '#737373' }} axisLine={false} tickLine={false} tickMargin={12} />
            <YAxis stroke="#737373" tick={{ fill: '#737373' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₺${value}`} tickMargin={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#121212', borderColor: '#2a2a2a', color: '#ffffff', borderRadius: '12px' }}
              itemStyle={{ color: '#ffffff' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            <Area 
              type="linear" 
              dataKey="gelir" 
              name="Gelir" 
              stroke="#22c55e" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorGelir)" 
            />
            <Area 
              type="linear" 
              dataKey="gider" 
              name="Gider" 
              stroke="#ef4444" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorGider)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Reveal>
  );
};
