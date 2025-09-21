import { useState } from "react";
import { useCart } from "../cart";
import PageHeader from "../components/PageHeader";
import SummaryCard from "../components/SummaryCard";
import CheckoutSummary from "../components/CheckoutSummary";
import formatDate from "../utils/formatDate";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const cartItems = Object.values(cart.items);
  const [pickupTime, setPickupTime] = useState("13:00");

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
      <PageHeader title="Tu Pedido" subtitle={formatDate(new Date())}/>
      
      <div className="px-4 overflow-y-auto py-5 pb-24">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-body1 text-gray-500 mb-4">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 pb-30">
            
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
