
import { getStatusColor, getStatusLabel } from '@/data/mockData';
import { ResourceStatus } from '@/types';

interface StatusBadgeProps {
  status: ResourceStatus;
  className?: string;
}

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const colorClass = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}>
      {label}
    </span>
  );
};
