import React from 'react';
import { OrderResponse } from '../services/api';
import StatusChip from './StatusChip';
import RightChevronIcon from '../assets/icons/RightChevron';

interface ActiveOrderCardProps {
  order: OrderResponse;
  onClick?: () => void;
  className?: string;
}

export default function ActiveOrderCard({ order, onClick, className = "" }: ActiveOrderCardProps) {
  // Get the appropriate background and text color classes based on status
  const getStatusClasses = (status: string) => {
    const statusConfig = {
      PENDING: {
        bg: 'bg-gray-600/10',
        text: 'text-gray-600',
      },
      PREPARING: {
        bg: 'bg-warning/10',
        text: 'text-warning',
      },
      READY: {
        bg: 'bg-success/10',
        text: 'text-success',
      },
      DELIVERED: {
        bg: 'bg-primary-500/10',
        text: 'text-primary-500',
      },
      CANCELLED: {
        bg: 'bg-error/10',
        text: 'text-error',
      },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.DELIVERED;
  };

  const { bg, text } = getStatusClasses(order.status);

  return (
    <div 
      className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${bg} ${className}`}
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="flex flex-col gap-1">
          <p className={`text-sub1 ${text}`}>
            Pedido {order.id}
          </p>
          <div className="w-fit">
            <StatusChip status={order.status} />
          </div>
          <p className={`text-body2 ${text}`}>
          $ {order.totalPrice}
        </p>
        </div>
      </div>
      <div className={text}>
        <RightChevronIcon />
      </div>
    </div>
  );
}
