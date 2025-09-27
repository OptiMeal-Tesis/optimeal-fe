import { useState } from "react";
import { useCart } from "../cart";
import { generateCartItemKey } from "../cart/cart";
import PageHeader from "../components/PageHeader";
import SummaryItemCard from "../components/SummaryCard";
import CheckoutSummary from "../components/CheckoutSummary";
import formatDate from "../utils/formatDate";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const cartItems = Object.values(cart.items);
  const [pickupTime, setPickupTime] = useState("13:00");

  const handleQuantityChange = (itemKey: string, newQuantity: number) => {
    const item = cart.items[itemKey];
    if (!item) return;

    // Check stock before allowing increase
    if (newQuantity > item.quantity) {
      const difference = newQuantity - item.quantity;
      if (item.stock < item.quantity + difference) {
        // Don't allow increase if it would exceed stock
        return;
      }
    }

    if (newQuantity === 0) {
      cart.remove(itemKey);
    } else {
      const currentQuantity = cart.items[itemKey]?.quantity || 0;
      const difference = newQuantity - currentQuantity;
      
      if (difference > 0) {
        for (let i = 0; i < difference; i++) {
          cart.increase(itemKey);
        }
      } else if (difference < 0) {
        for (let i = 0; i < Math.abs(difference); i++) {
          cart.decrease(itemKey);
        }
      }
    }
  };

  const handleEdit = (productId: string) => {
    // Find the specific item being edited to get its exact details
    const itemToEdit = cartItems.find(item => item.productId === productId);
    if (itemToEdit) {
      // Don't allow editing if product is out of stock
      if (itemToEdit.stock === 0) {
        alert('Este producto está fuera de stock. Solo puedes eliminarlo del carrito.');
        return;
      }
      
      const itemKey = generateCartItemKey(itemToEdit.productId, itemToEdit.selectedSide);
      navigate(`/checkout/edit/${productId}?itemKey=${itemKey}`);
    }
  };

  const validateRequiredSides = (): boolean => {
    return cartItems.every(item => {
      if (item.sides.length === 0) {
        return true;
      }
      return item.selectedSide !== null && item.selectedSide !== undefined;
    });
  };

  const validatePickupTime = (time: string): boolean => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const minTime = 12 * 60; 
    const maxTime = 15 * 60;
    return totalMinutes >= minTime && totalMinutes <= maxTime;
  };

  const isTimeValid = validatePickupTime(pickupTime);
  const isCheckoutValid = (): boolean => {
    return validateRequiredSides() && isTimeValid;
  };

  const handleCheckout = () => {
    navigate('/checkout/payment');
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <PageHeader title="Tu Pedido" subtitle={formatDate(new Date())} onNavigate={() => navigate('/home')} />
      
      <div className="px-4 overflow-y-auto py-5 pb-24">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-body1 text-gray-500 mb-4">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 pb-30">
            {cartItems.map((item) => {
              const itemKey = generateCartItemKey(item.productId, item.selectedSide);
              const isOutOfStock = item.stock === 0;
              const canIncrease = item.stock > item.quantity;
              
              return (
                <div key={itemKey}>
                  {isOutOfStock && (
                    <div className="bg-red-50 border border-error rounded-lg p-3 mb-2">
                      <p className="text-error text-sm font-medium text-center">
                        Este producto está fuera de stock
                      </p>
                    </div>
                  )}
                    {!isOutOfStock && !canIncrease && (
                      <div className="bg-red-50 border border-error rounded-lg p-3 mb-2">
                        <p className="text-error text-sm font-medium text-center">
                          No hay más stock disponible para este producto
                        </p>
                      </div>
                    )}
                  <SummaryItemCard
                    productId={item.productId}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    photo={item.photo}
                    sides={item.sides}
                    selectedSide={item.selectedSide}
                    itemKey={itemKey}
                    onQuantityChange={handleQuantityChange}
                    onEdit={handleEdit}
                  />
                </div>
              );
            })}
            
          </div>
        )}
      </div>
      
      {cartItems.length > 0 && (
        <CheckoutSummary
          subtotal={cart.subtotal}
          isDisabled={cart.subtotal === 0 || (!isCheckoutValid())}
          onCheckout={handleCheckout}
          pickupTime={pickupTime}
          onPickupTimeChange={setPickupTime}
          isTimeValid={isTimeValid}
        />
      )}
    </div>
  );
}
