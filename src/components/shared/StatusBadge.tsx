import type { ReactNode } from 'react';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info';
  children: ReactNode;
  className?: string;
}

export const StatusBadge = ({ status, children, className = '' }: StatusBadgeProps) => {
  const statusStyles = {
    success: 'bg-accent-success/20 text-accent-success border-accent-success',
    warning: 'bg-accent-warning/20 text-accent-warning border-accent-warning',
    danger: 'bg-accent-danger/20 text-accent-danger border-accent-danger',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-bold text-xs whitespace-nowrap ${statusStyles[status]} ${className}`}
      style={{ minWidth: 'fit-content', maxWidth: 'none', flexShrink: 0 }}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status === 'success' ? 'bg-accent-success' : status === 'warning' ? 'bg-accent-warning' : status === 'danger' ? 'bg-accent-danger' : 'bg-blue-400'}`} />
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
};

