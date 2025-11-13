import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, className = '' }: StatCardProps) => {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-text-secondary text-sm font-bold mb-1">{title}</p>
          <p className="text-2xl font-black text-text-primary">{value}</p>
          {trend && (
            <p className={`text-xs font-bold mt-2 ${trend.isPositive ? 'text-accent-success' : 'text-accent-danger'}`}>
              {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2 bg-primary-bg-secondary rounded-lg">
            <Icon className="w-5 h-5 text-text-secondary" />
          </div>
        )}
      </div>
    </div>
  );
};

