import { useCart } from "../cart";
import PageHeader from "../components/PageHeader";
import SummaryCard from "../components/SummaryCard";
import formatDate from "../utils/formatDate";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const peso = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  const cartItems = Object.values(cart.items);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      cart.remove(productId);
    } else {
      const currentQuantity = cart.items[productId]?.quantity || 0;
      const difference = newQuantity - currentQuantity;
      
      if (difference > 0) {
        for (let i = 0; i < difference; i++) {
          cart.increase(productId);
        }
      } else if (difference < 0) {
        for (let i = 0; i < Math.abs(difference); i++) {
          cart.decrease(productId);
        }
      }
    }
  };

  const handleEdit = (productId: string) => {
    navigate(`/checkout/edit/${productId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Tu Pedido" subtitle={formatDate(new Date())}/>
      
      <div className="px-4 py-8 pb-24">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-body1 text-gray-500 mb-4">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            
            {cartItems.map((item) => (
              <SummaryCard
                key={item.productId}
                productId={item.productId}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                photo={item.photo}
                sides={item.sides}
                selectedSide={item.selectedSide}
                onQuantityChange={handleQuantityChange}
                onEdit={handleEdit}
              />
            ))}
            
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-h3 font-bold text-black">Total</span>
                <span className="text-h3 font-bold text-black">{peso.format(cart.subtotal)}</span>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
