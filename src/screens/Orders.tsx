import React, { useState, useEffect } from 'react';
import PageHeader from "../components/PageHeader";
import OrderCard from "../components/OrderCard";
import { useNavigate } from "react-router-dom";
import { apiService, OrderResponse } from "../services/api";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserOrders();
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setError('Error al cargar los pedidos');
      }
    } catch (err) {
      setError('Error al cargar los pedidos');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  const activeOrders = orders.filter(order => 
    order.status === 'PENDING' || order.status === 'PREPARING' || order.status === 'READY'
  );
  
  const previousOrders = orders.filter(order => 
    order.status === 'DELIVERED' || order.status === 'CANCELLED'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title="Pedidos" onNavigate={() => navigate('/home')}/>
        <div className="p-8 flex justify-center items-center">
          <div className="text-body1 text-gray-500">Cargando pedidos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title="Pedidos" onNavigate={() => navigate('/home')}/>
        <div className="p-8 flex justify-center items-center">
          <div className="text-body1 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Pedidos" onNavigate={() => navigate('/home')}/>
      
      <div className="p-5">
        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <>
            <p className="text-sub1 text-gray-500 mb-4">
              Pedidos activos
            </p>
            <div className="space-y-4 mb-8">
              {activeOrders.map((order) => (
                <OrderCard
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
            <p className="text-sub1 text-gray-600 mb-4">
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
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-body1 text-gray-500 mb-2">No tienes pedidos aún</div>
            <div className="text-body2 text-gray-400">Realiza tu primer pedido desde el menú</div>
          </div>
        )}
      </div>
    </div>
  );
}
