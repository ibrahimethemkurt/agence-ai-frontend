import { Reveal } from '../../../components/animation/Reveal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: Array<{ name: string; value: number }>;
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <Reveal variant="fadeUp" className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] h-[400px]">
      <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-6">Gelir Trendi</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--color-muted)" tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--color-muted)" tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₺${value}`} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-fg)' }}
              itemStyle={{ color: 'var(--color-accent)' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-accent)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-accent)', strokeWidth: 2 }}
              activeDot={{ r: 8, fill: 'var(--color-accent-2)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Reveal>
  );
};
