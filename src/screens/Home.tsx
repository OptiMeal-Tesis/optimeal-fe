import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductCard, { type Restriction } from "../components/ProductCard";
import SubtotalButton from "../components/SubtotalButton";
import { apiService } from "../services/api";
import { useCart } from "../cart";
import { generateCartItemKey } from "../cart/cart";
import type { OrderResponse, Product } from "../services/api";
import ActiveOrderCard from "../components/ActiveOrderCard";

export default function Home() {
  const navigate = useNavigate();
  const cart = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<OrderResponse | null>(null);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products and orders in parallel
        const [productsResponse, ordersResponse] = await Promise.all([
          apiService.getProducts(),
          apiService.getUserOrders()
        ]);

        if (productsResponse.success) {
          setProducts(productsResponse.data);
        } else {
          setError(productsResponse.message || 'Error al cargar productos');
        }
        if (ordersResponse.success && ordersResponse.data) {
          // Find the first active order (not delivered or cancelled)
          const activeOrder = ordersResponse.data.find(order => 
            order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
          );
          setActiveOrder(activeOrder || null);
        }
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white h-screen flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white">
        <Header onMenuClick={handleMenuClick} />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 gap-3">
          {activeOrder && (
            <ActiveOrderCard 
              order={activeOrder} 
              className="mb-3"
              onClick={() => navigate(`/orders/${activeOrder.id}`)}
            />
          )}
          <h1 className="text-sub1 text-black mb-6">
            Platos
          </h1>
          
          {loading && (
            <div className="flex justify-center items-center py-8">
              <p className="text-body1 text-gray-500">Cargando platos...</p>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center py-8">
              <p className="text-body1 text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <p className="text-body1 text-gray-500">No hay platos disponibles</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="flex flex-col gap-3 pb-24">
              {products.map((product) => {
                const totalQuantity = cart.getTotalQuantityByProductId(product.id);
                const hasActiveSides = product.sides && product.sides.some(s => s.isActive);
                
                const handleAdd = () => {
                  if (hasActiveSides) {
                    // Redirect to edit page for items with sides
                    navigate(`/checkout/edit/${product.id}`);
                  } else {
                    // Add directly to cart for items without sides
                    cart.add(product);
                  }
                };

                const handleIncrease = () => {
                  if (hasActiveSides) {
                    // Redirect to edit page for items with sides
                    navigate(`/checkout/edit/${product.id}`);
                  } else {
                    // Find the item without sides and increase quantity
                    const itemWithoutSides = Object.values(cart.items).find(
                      item => item.productId === product.id && !item.selectedSide
                    );
                    if (itemWithoutSides) {
                      const itemKey = generateCartItemKey(product.id, itemWithoutSides.selectedSide);
                      cart.increase(itemKey);
                    }
                  }
                };

                const handleDecrease = () => {
                  // Find the item without sides and decrease quantity
                  const itemWithoutSides = Object.values(cart.items).find(
                    item => item.productId === product.id && !item.selectedSide
                  );
                  if (itemWithoutSides) {
                    const itemKey = generateCartItemKey(product.id, itemWithoutSides.selectedSide);
                    cart.decrease(itemKey);
                  }
                };

                return (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    photo={product.photo}
                    restrictions={product.restrictions as Restriction[]}
                    variant={totalQuantity > 0 ? "active" : "default"}
                    quantity={totalQuantity}
                    stock={product.stock}
                    onAdd={handleAdd}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      
      <SubtotalButton
        subtotal={cart.subtotal}
        disabled={cart.subtotal === 0}
        onContinue={() => navigate('/checkout')}
      />
    </div>
  );
}
