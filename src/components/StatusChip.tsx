import React from 'react';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

interface StatusChipProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: 'Pendiente',
    textColor: 'var(--color-gray-600)',
    backgroundColor: 'rgba(93, 93, 93, 0.2)', // 5D5D5D with 20% opacity
  },
  PREPARING: {
    label: 'En Progreso',
    textColor: 'var(--color-warning)',
    backgroundColor: 'rgba(240, 177, 0, 0.2)', // F0B100 with 20% opacity
  },
  READY: {
    label: 'Listo',
    textColor: 'var(--color-success)',
    backgroundColor: 'rgba(76, 175, 80, 0.2)', // 4CAF50 with 20% opacity
  },
  DELIVERED: {
    label: 'Entregado',
    textColor: 'var(--color-primary-500)',
    backgroundColor: 'rgba(13, 71, 161, 0.2)', // 0D47A1 with 20% opacity
  },
  CANCELLED: {
    label: 'Cancelado',
    textColor: 'var(--color-error)',
    backgroundColor: 'rgba(244, 67, 54, 0.2)', // F44336 with 20% opacity
  },
};

export default function StatusChip({ status, className = '' }: StatusChipProps) {
  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center justify-center px-2 py-1 rounded-[14px] ${className}`}
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        minHeight: '23px',
      }}
    >
      <span className="text-body2 font-medium whitespace-nowrap">
        {config.label}
      </span>
    </div>
  );
}
