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

  const getStatusMessage = (status: OrderStatus, pickUpTime: Date) => {
    const pickUpTimeFormatted = new Date(pickUpTime).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    switch (status) {
      case 'PENDING':
        return `Tu pedido estará listo a las ${pickUpTimeFormatted}`;
      case 'PREPARING':
        return `Tu pedido estará listo a las ${pickUpTimeFormatted}`;
      case 'READY':
        return `Tu pedido está listo para retirar`;
      case 'DELIVERED':
        return `Retiraste tu pedido a las ${pickUpTimeFormatted}`;
      case 'CANCELLED':
        return `Tu pedido fue cancelado. Reintegro mediante Mercado Pago, si corresponde. Puede demorar.`;
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-white flex flex-col">
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
      <div className="h-screen bg-white flex flex-col">
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
    <div className="h-screen bg-white flex flex-col">
      <PageHeader 
        title={`Pedido ${order.id}`} 
        subtitle={formatDate(new Date(order.createdAt))} 
        onNavigate={() => navigate('/orders')} 
      />
      
      <div className="px-4 overflow-y-auto py-5 pb-24">
        {/* Status Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className={`text-body2 text-black`}>
              {getStatusMessage(order.status, order.pickUpTime)}
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
            $ {order.totalPrice}
          </span>
        </div>
      </div>
    </div>
  );
}
