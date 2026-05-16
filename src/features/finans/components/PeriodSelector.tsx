interface PeriodSelectorProps {
  periods: string[];
  selectedPeriod: string;
  onSelect: (period: string) => void;
}

export const PeriodSelector = ({ periods, selectedPeriod, onSelect }: PeriodSelectorProps) => {
  return (
    <div className="flex bg-[var(--color-surface)] p-1 rounded-lg border border-[var(--color-border)]">
      {periods.map(period => (
        <button
          key={period}
          onClick={() => onSelect(period)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            selectedPeriod === period 
              ? 'bg-white text-black shadow-sm' 
              : 'text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-border)]/50'
          }`}
        >
          {period}
        </button>
      ))}
    </div>
  );
};
