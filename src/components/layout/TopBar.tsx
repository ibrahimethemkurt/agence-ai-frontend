

export const TopBar = () => {
  return (
    <header className="h-[72px] bg-[var(--color-bg)] border-b border-[var(--color-border)] flex items-center justify-between px-8">
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Arama yapın..."
          className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-fg)] text-sm rounded-md px-4 py-2 focus:outline-none focus:border-[var(--color-accent)] transition-colors font-body placeholder:text-[var(--color-fg)] placeholder:opacity-40"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium text-[var(--color-fg)] font-body">Kullanıcı</div>
          <div className="text-xs text-[var(--color-fg)] opacity-50 font-body">Yönetici</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-fg)] font-bold font-display">
          K
        </div>
      </div>
    </header>
  );
};
