import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductCard, { type Restriction } from "../components/ProductCard";
import SubtotalButton from "../components/SubtotalButton";
import { apiService } from "../services/api";
import { useCart } from "../cart";
import { generateCartItemKey } from "../cart/cart";
import type { Product } from "../services/api";
import ActiveOrdersCarousel from "../components/ActiveOrdersCarousel";
import ImagePlaceholder from "../assets/images/image-placeholder.jpg";
import { useOrdersRealtime } from "../contexts/OrdersRealtimeContext";

export default function Home() {
  const navigate = useNavigate();
  const cart = useCart();
  const { activeOrders } = useOrdersRealtime();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productsData, setProductsData] = useState<{ foods: Product[]; beverages: Product[] }>({ foods: [], beverages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const productsResponse = await apiService.getProducts();

        if (productsResponse.success) {
          setProductsData(productsResponse.data);
        } else {
          setError(productsResponse.message || 'Error al cargar productos');
        }
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderProductCards = (products: Product[]) => {
    return products.map((product) => {
      const totalQuantity = cart.getTotalQuantityByProductId(product.id);
      const hasActiveSides = product.sides && product.sides.some(s => s.isActive);
      
      // Handler for clicking the card itself
      const handleCardClick = () => {
        const itemKey = generateCartItemKey(product.id, null);
        navigate(`/checkout/edit/${product.id}?itemKey=${itemKey}`);
      };

      // Handler for clicking the + button
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
            item => item.productId == product.id && !item.selectedSide
          );
          if (itemWithoutSides) {
            const itemKey = generateCartItemKey(product.id, itemWithoutSides.selectedSide);
            cart.increase(itemKey);
          }
        }
      };

      const handleDecrease = () => {
        if (hasActiveSides) {
          // Navigate to checkout page so user can choose which specific item to decrease
          navigate('/checkout');
        } else {
          // Find the item without sides and decrease quantity
          const itemWithoutSides = Object.values(cart.items).find(
            item => item.productId == product.id && !item.selectedSide
          );
          if (itemWithoutSides) {
            const itemKey = generateCartItemKey(product.id, itemWithoutSides.selectedSide);
            cart.decrease(itemKey);
          }
        }
      };

      return (
        <ProductCard
          key={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          photo={product.photo ? product.photo : ImagePlaceholder}
          restrictions={product.restrictions as Restriction[]}
          variant={totalQuantity > 0 ? "active" : "default"}
          quantity={totalQuantity}
          stock={product.stock}
          onCardClick={handleCardClick}
          onAdd={handleAdd}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      );
    });
  };

  return (
    <div className="bg-white h-screen flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white">
        <Header onMenuClick={handleMenuClick} />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 gap-3">
          {activeOrders.length > 0 && (
            <ActiveOrdersCarousel 
              orders={activeOrders} 
              className="mb-3"
              onOrderClick={(orderId) => navigate(`/orders/${orderId}`)}
            />
          )}
          
          {loading && (
            <div className="flex justify-center items-center py-8">
              <p className="text-body1 text-gray-500">Cargando productos...</p>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center py-8">
              <p className="text-body1 text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && productsData.foods.length === 0 && productsData.beverages.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <p className="text-body1 text-gray-500">No hay productos disponibles</p>
            </div>
          )}

          {!loading && !error && (productsData.foods.length > 0 || productsData.beverages.length > 0) && (
            <div className="flex flex-col gap-6 pb-28">
              {/* Foods Section */}
              {productsData.foods.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h1 className="text-sub1 text-black">
                    Platos
                  </h1>
                  <div className="flex flex-col gap-3">
                    {renderProductCards(productsData.foods)}
                  </div>
                </div>
              )}

              {/* Beverages Section */}
              {productsData.beverages.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h1 className="text-sub1 text-black">
                    Bebidas
                  </h1>
                  <div className="flex flex-col gap-3">
                    {renderProductCards(productsData.beverages)}
                  </div>
                </div>
              )}
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
