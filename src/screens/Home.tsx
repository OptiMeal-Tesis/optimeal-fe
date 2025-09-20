import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductCard, { type Restriction } from "../components/ProductCard";
import SubtotalButton from "../components/SubtotalButton";
import { apiService } from "../services/api";
import { useCart } from "../cart";
import type { Product } from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const cart = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        if (response.success) {
          setProducts(response.data);
        } else {
          setError(response.message || 'Error al cargar productos');
        }
      } catch (err) {
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white h-screen flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white">
        <Header onMenuClick={handleMenuClick} />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
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
            <div className="flex flex-col gap-6 pb-24">
              {products.map((product) => {
                const quantity = cart.items[product.id]?.quantity ?? 0;
                return (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    photo={product.photo}
                    restrictions={product.restrictions as Restriction[]}
                    variant={quantity > 0 ? "active" : "default"}
                    quantity={quantity}
                    onAdd={() => cart.add(product)}
                    onIncrease={() => cart.increase(product.id)}
                    onDecrease={() => cart.decrease(product.id)}
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
