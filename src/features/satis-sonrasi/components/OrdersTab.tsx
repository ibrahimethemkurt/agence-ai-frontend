
import { StatusBadge } from '../../../components/ui/StatusBadge';

interface OrdersTabProps {
  orders: Array<{
    id: string;
    date: string;
    product: string;
    platform: string;
    amount: number;
    status: string;
  }>;
}

export const OrdersTab = ({ orders }: OrdersTabProps) => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
              <th className="p-4 text-sm font-medium text-[var(--color-muted)]">Sipariş No</th>
              <th className="p-4 text-sm font-medium text-[var(--color-muted)]">Tarih</th>
              <th className="p-4 text-sm font-medium text-[var(--color-muted)]">Ürün</th>
              <th className="p-4 text-sm font-medium text-[var(--color-muted)]">Platform</th>
              <th className="p-4 text-sm font-medium text-[var(--color-muted)]">Tutar</th>
              <th className="p-4 text-sm font-medium text-[var(--color-muted)]">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[var(--color-border)]/20 transition-colors">
                <td className="p-4 text-sm font-medium">{order.id}</td>
                <td className="p-4 text-sm text-[var(--color-muted)]">{order.date}</td>
                <td className="p-4 text-sm">{order.product}</td>
                <td className="p-4 text-sm text-[var(--color-muted)]">{order.platform}</td>
                <td className="p-4 text-sm font-medium">₺{order.amount}</td>
                <td className="p-4">
                  <StatusBadge status={order.status as any} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
