import { Stagger } from '../../../components/animation/Stagger';
import { Reveal } from '../../../components/animation/Reveal';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Bot, Clock, Loader2 } from 'lucide-react';

interface ActiveAgentsProps {
  agents: Array<{ id: string; product: string; type: string; status: string; startTime: string; progress: number }>;
}

export const ActiveAgents = ({ agents }: ActiveAgentsProps) => {
  return (
    <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {agents.map((agent) => (
        <Reveal key={agent.id} variant="scaleIn" className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 left-0 h-1 bg-[var(--color-accent)] transition-all duration-1000 ease-linear" style={{ width: `${agent.progress}%` }} />
          
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[var(--color-bg)] text-[var(--color-accent)] border border-[var(--color-border)]">
                {agent.status === 'aktif' ? <Loader2 className="animate-spin" size={24} /> : <Bot size={24} />}
              </div>
              <div>
                <h4 className="font-display font-medium text-[var(--color-fg)] text-lg">{agent.product}</h4>
                <p className="text-sm text-[var(--color-muted)]">{agent.type}</p>
              </div>
            </div>
            <StatusBadge status={agent.status as any} />
          </div>

          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mt-auto pt-4 border-t border-[var(--color-border)]">
            <Clock size={16} />
            <span>Başlangıç: {agent.startTime}</span>
            <span className="ml-auto font-medium">{agent.progress}%</span>
          </div>
        </Reveal>
      ))}
    </Stagger>
  );
};
