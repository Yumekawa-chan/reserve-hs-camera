import { getStatusColor, getStatusText } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'reserved' | 'in-use' | 'completed';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
        status
      )} ${className}`}
    >
      {getStatusText(status)}
    </span>
  );
} 