import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, OrderResponse, OrderStatus } from '../services/api';
import PageHeader from '../components/PageHeader';
import OrderItemCard from '../components/OrderItemCard';
import StatusChip from '../components/StatusChip';
import formatDate from '../utils/formatDate';

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const peso = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiService.getOrderById(parseInt(orderId));
        
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError(response.message || 'Failed to fetch order');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusMessage = (status: OrderStatus, shift: string) => {
    const shiftStartTime = shift.split('-')[0];

    switch (status) {
      case 'PENDING':
        return `Tu pedido estará listo a las ${shiftStartTime}`;
      case 'PREPARING':
        return `Tu pedido estará listo a las ${shiftStartTime}`;
      case 'READY':
        return `Tu pedido está listo!`;
      case 'DELIVERED':
        return `Retiraste tu pedido a las ${shiftStartTime}`;
      case 'CANCELLED':
        return `Tu pedido fue cancelado. Reintegro mediante Mercado Pago, si corresponde. Puede demorar.`;
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-white flex flex-col">
        <PageHeader 
          title="Pedido" 
          onNavigate={() => navigate('/orders')} 
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-body1 text-gray-500">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    const errorMessage = error 
      ? error 
      : `No se encontró una orden con ID ${orderId}`;
    
    return (
      <div className="min-h-[100dvh] bg-white flex flex-col">
        <PageHeader 
          title="Error" 
          onNavigate={() => navigate('/orders')} 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-body1 text-error mb-4">
              {errorMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col relative">
      <PageHeader 
        title={`Pedido ${order.id}`} 
        subtitle={formatDate(new Date(order.createdAt))} 
        onNavigate={() => navigate('/orders')} 
      />
      
      <div className="px-4 overflow-y-auto pt-3 pb-28">
        {/* Status Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className={`text-body2 text-black`}>
              {getStatusMessage(order.status, order.shift)}
            </p>
            <StatusChip status={order.status} />
          </div>
        </div>

        {/* Order Items */}
        <div className="flex flex-col gap-5 pb-30">
          {order.orderItems.map((orderItem) => (
            <OrderItemCard
              key={`${orderItem.productId}-${orderItem.sideId || 'no-side'}`}
              orderItem={orderItem}
            />
          ))}
        </div>
      </div>
      
      {/* Total Summary */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex justify-between items-center">
          <span className="text-body1 text-black">Total</span>
          <span className="text-body1-bold text-black">
            {peso.format(order.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
