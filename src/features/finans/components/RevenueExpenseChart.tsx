import { Reveal } from '../../../components/animation/Reveal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueExpenseChartProps {
  data: Array<{ name: string; gelir: number; gider: number }>;
}

export const RevenueExpenseChart = ({ data }: RevenueExpenseChartProps) => {
  return (
    <Reveal variant="fadeUp" className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] h-[400px]">
      <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-6">Gelir / Gider Karşılaştırması</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--color-muted)" tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--color-muted)" tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₺${value}`} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-fg)', borderRadius: '8px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="gelir" name="Gelir" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gider" name="Gider" fill="var(--color-danger)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Reveal>
  );
};
