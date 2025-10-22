import React, { useEffect } from 'react';
import PageHeader from "../components/PageHeader";
import OrderCard from "../components/OrderCard";
import ActiveOrderCard from "../components/ActiveOrderCard";
import { useNavigate } from "react-router-dom";
import { clearCartFromStorage } from "../cart/cart";
import { authService } from "../services/auth";
import { useOrdersRealtime } from "../contexts/OrdersRealtimeContext";
import CustomButton from '../components/CustomButton';

export default function Orders() {
  const navigate = useNavigate();
  const { activeOrders, previousOrders, loading, error } = useOrdersRealtime();
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');

  useEffect(() => {
    if (success === 'true') {
      const currentUser = authService.getCurrentUser();
      clearCartFromStorage(currentUser?.email || null);
    }
  }, [success]);

  const handleOrderClick = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  const handleBackNavigation = () => {
    if (success == 'true') {
      navigate('/home');
    } else {
      window.history.length > 1 ? navigate(-1) : navigate('/home');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title="Pedidos" />
        <div className="p-8 flex justify-center items-center">
          <div className="text-body1 text-gray-500">Cargando pedidos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title="Pedidos" />
        <div className="p-8 flex justify-center items-center">
          <div className="text-body1 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <PageHeader title="Pedidos" onNavigate={handleBackNavigation}/>
      
      <div className="flex-1 overflow-y-auto p-5 mb-8">
        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <>
            <p className="text-sub1 text-black mb-4">
              Pedidos activos
            </p>
            <div className="flex flex-col gap-4 overflow-y-auto mb-8">
              {activeOrders.map((order) => (
                <ActiveOrderCard
                  key={order.id}
                  order={order}
                  onClick={() => handleOrderClick(order.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Previous Orders Section */}
        {previousOrders.length > 0 && (
          <>
            <p className="text-sub1 text-black mb-4">
              Pedidos anteriores
            </p>
            <div className="space-y-4">
              {previousOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => handleOrderClick(order.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && activeOrders.length === 0 && previousOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-6">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-body1 text-gray-500 mb-2">No tienes pedidos aún</div>
              <div className="text-body2 text-gray-400">Realiza tu primer pedido desde el menú</div>
            </div>
            <CustomButton
              onClick={() => navigate('/home')}
              className="p-10 bg-primary-500 text-white rounded-lg"
            >
              Ir al menú
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
}
