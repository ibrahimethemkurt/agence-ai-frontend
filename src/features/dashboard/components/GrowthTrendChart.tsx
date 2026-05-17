
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Reveal } from '../../../components/animation/Reveal';

export const GrowthTrendChart = ({ data }: { data: any[] }) => {
  return (
    <Reveal variant="fadeUp" className="h-full">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 h-full flex flex-col">
        <h2 className="text-xl font-display font-semibold text-[var(--color-fg)] mb-6">Şirket Büyüme Trendi (%)</h2>
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E1E1E" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(val) => `%${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121212', borderColor: '#2E2E2E', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="growth" name="Büyüme Oranı" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Reveal>
  );
};
