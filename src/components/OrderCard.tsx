import React from 'react';
import { OrderResponse } from '../services/api';
import StatusChip from './StatusChip';
import formatDate from '../utils/formatDate';
import RightChevronIcon from '../assets/icons/RightChevron';

interface OrderCardProps {
  order: OrderResponse;
  onClick?: () => void;
  className?: string;
}

export default function OrderCard({ order, onClick, className = "" }: OrderCardProps) {
  const formatOrderDate = (date: Date) => {
    const now = new Date();
    const orderDate = new Date(date);
    const diffTime = now.getTime() - orderDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `${diffDays} días`;
    } else {
      return formatDate(orderDate);
    }
  };
  const peso = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  return (
    <div 
      className={`flex items-center justify-between px-3 py-1.5 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${className}`}
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="flex flex-col gap-1 mb-2">
          <p className="text-sub1 text-gray-500">
            Pedido {order.id} - {formatOrderDate(order.createdAt)}
          </p>
          <div className="w-fit">
            <StatusChip status={order.status} />
          </div>
        </div>
        <p className="text-body2 text-gray-500">
          {peso.format(order.totalPrice)}
        </p>
      </div>
        <div className="text-gray-500">
          <RightChevronIcon />
        </div>
    </div>
  );
}
