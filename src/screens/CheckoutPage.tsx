import { useCart } from "../cart";
import QuantityControl from "../components/QuantityControl";
import PageHeader from "../components/PageHeader";

export default function CheckoutPage() {
  const cart = useCart();
  const peso = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  const cartItems = Object.values(cart.items);

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Tu Pedido" />
      
      <div className="p-8 pb-24">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-body1 text-gray-500 mb-4">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {cartItems.map((item) => (
              <div key={item.productId} className="flex gap-4 bg-white rounded-xl p-4 border border-gray-200">
                {item.photo && (
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-[80px] h-[80px] object-cover rounded-lg"
                  />
                )}
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-body1 font-bold text-black">{item.name}</h3>
                    <p className="text-body2 text-gray-600">
                      {peso.format(item.price)} c/u
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-body1 font-bold text-black">
                      {peso.format(item.price * item.quantity)}
                    </span>
                    
                    <QuantityControl
                      quantity={item.quantity}
                      onDecrease={() => cart.decrease(item.productId)}
                      onIncrease={() => cart.increase(item.productId)}
                    />
                  </div>
                </div>
              </div>
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
