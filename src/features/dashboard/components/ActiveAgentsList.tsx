
import { Reveal } from '../../../components/animation/Reveal';
import { Stagger } from '../../../components/animation/Stagger';

export const ActiveAgentsList = ({ agents }: { agents: any[] }) => {
  return (
    <Reveal variant="fadeUp" className="h-full">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-5 h-full">
        <h2 className="text-lg font-display font-semibold text-[var(--color-fg)] mb-4">Sistemde Çalışan AI Ajanları</h2>
        <Stagger className="flex flex-col gap-3" staggerDelay={0.1}>
          {agents.map((agent: any) => (
            <Reveal key={agent.id} variant="fadeUp">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0A0A0A] border border-[var(--color-border)] hover:border-[#8B5CF6]/50 transition-colors">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#121212] flex-none">
                  {agent.status === 'active' && <div className="absolute inset-0 rounded-full animate-ping bg-[#10B981] opacity-20"></div>}
                  <div className={`w-2.5 h-2.5 rounded-full ${agent.status === 'active' ? 'bg-[#10B981]' : agent.status === 'processing' ? 'bg-[#F59E0B]' : 'bg-gray-500'}`}></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-[var(--color-fg)] mb-0.5">{agent.name}</h3>
                  <p className="text-xs text-[var(--color-muted)] line-clamp-1">{agent.task}</p>
                </div>
                <div className="flex-none text-[11px] px-2.5 py-1 rounded-full bg-[#1A1A1A] text-gray-400 border border-[#2A2A2A] font-medium">
                  {agent.status === 'active' ? 'Çalışıyor' : agent.status === 'processing' ? 'İşleniyor' : 'Beklemede'}
                </div>
              </div>
            </Reveal>
          ))}
        </Stagger>
      </div>
    </Reveal>
  );
};
