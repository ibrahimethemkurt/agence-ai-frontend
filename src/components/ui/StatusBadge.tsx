interface StatusBadgeProps {
  status: 'tamamlandı' | 'bekliyor' | 'hata' | 'olumlu' | 'olumsuz' | 'aktif' | 'pasif';
  className?: string;
}

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  let styles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ';

  switch (status) {
    case 'tamamlandı':
    case 'olumlu':
    case 'aktif':
      styles += 'bg-[var(--color-success)]/20 text-[var(--color-success)] border border-[var(--color-success)]/30';
      break;
    case 'hata':
    case 'olumsuz':
    case 'pasif':
      styles += 'bg-[var(--color-danger)]/20 text-[var(--color-danger)] border border-[var(--color-danger)]/30';
      break;
    case 'bekliyor':
      styles += 'bg-[var(--color-warning)]/20 text-[var(--color-warning)] border border-[var(--color-warning)]/30';
      break;
    default:
      styles += 'bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)]';
  }

  // Capitalize first letter
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`${styles} ${className}`}>
      {label}
    </span>
  );
};
