import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode,
  useCallback,
  useRef
} from 'react';
import { supabase } from '../services/supabase';
import { apiService, OrderResponse } from '../services/api';
import { RealtimeChannel } from '@supabase/supabase-js';

const ORDERS_CHANNEL = 'orders-realtime';

interface OrdersRealtimeContextType {
  orders: OrderResponse[];
  loading: boolean;
  error: string | null;
  refetchOrders: () => Promise<void>;
  activeOrders: OrderResponse[];
  previousOrders: OrderResponse[];
  getOrderById: (orderId: number) => OrderResponse | undefined;
}

const OrdersRealtimeContext = createContext<OrdersRealtimeContextType | undefined>(undefined);

interface OrdersRealtimeProviderProps {
  children: ReactNode;
}

export function OrdersRealtimeProvider({ children }: OrdersRealtimeProviderProps) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    try {
      return !!localStorage.getItem('optimeal_access_token');
    } catch {
      return false;
    }
  }, []);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    // Only fetch if user is authenticated
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
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
  }, [isAuthenticated]);

  // Handle new order broadcast
  const handleNewOrder = useCallback((payload: any) => {
    const newOrder = payload.order;
    
    setOrders(prevOrders => {
      // Check if order already exists
      const exists = prevOrders.some(order => order.id === newOrder.id);
      if (exists) {
        return prevOrders;
      }
      // Add new order at the beginning
      return [newOrder, ...prevOrders];
    });
  }, []);

  // Handle order status update
  const handleOrderStatusUpdate = useCallback((payload: any) => {
    const updatedOrder = payload.order;
    
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id === updatedOrder.id) {
          // Update the order with new data
          return {
            ...order,
            ...updatedOrder,
            status: updatedOrder.status,
            updatedAt: new Date(updatedOrder.updatedAt || new Date())
          };
        }
        return order;
      });
    });
  }, []);

  // Setup Supabase Realtime subscription
  useEffect(() => {
    // Only setup subscription if user is authenticated
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchOrders();

    // Subscribe to realtime updates
    const channel = supabase.channel(ORDERS_CHANNEL);
    
    channel
      .on('broadcast', { event: 'new-order' }, (payload) => {
        handleNewOrder(payload.payload);
      })
      .on('broadcast', { event: 'order-status-updated' }, (payload) => {
        handleOrderStatusUpdate(payload.payload);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
        } else if (status === 'CHANNEL_ERROR') {
        } else if (status === 'TIMED_OUT') {
        } else if (status === 'CLOSED') {
        }
      });

    channelRef.current = channel;

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchOrders, handleNewOrder, handleOrderStatusUpdate, isAuthenticated]);

  // Filtered orders
  const activeOrders = orders.filter(order => 
    order.status === 'PENDING' || order.status === 'PREPARING' || order.status === 'READY'
  );
  
  const previousOrders = orders.filter(order => 
    order.status === 'DELIVERED' || order.status === 'CANCELLED'
  );

  // Get order by ID
  const getOrderById = useCallback((orderId: number) => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const value: OrdersRealtimeContextType = {
    orders,
    loading,
    error,
    refetchOrders: fetchOrders,
    activeOrders,
    previousOrders,
    getOrderById,
  };

  return (
    <OrdersRealtimeContext.Provider value={value}>
      {children}
    </OrdersRealtimeContext.Provider>
  );
}

// Custom hook to use the orders realtime context
export function useOrdersRealtime() {
  const context = useContext(OrdersRealtimeContext);
  if (context === undefined) {
    throw new Error('useOrdersRealtime must be used within an OrdersRealtimeProvider');
  }
  return context;
}

