import { useState } from "react";
import { useCart } from "../cart";
import { generateCartItemKey } from "../cart/cart";
import PageHeader from "../components/PageHeader";
import SummaryItemCard from "../components/SummaryCard";
import CheckoutSummary from "../components/CheckoutSummary";
import formatDate from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { apiService, CheckoutRequest } from "../services/api";
import formatTime from "../utils/formatTime";
import ImagePlaceholder from "../assets/images/image-placeholder.jpg";

export default function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const cartItems = Object.values(cart.items);
  const [pickupTime, setPickupTime] = useState(formatTime(new Date()));
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const transformCartToCheckoutRequest = (): CheckoutRequest => {
    const items = cartItems.map(item => ({
      productId: parseInt(item.productId),
      quantity: item.quantity,
      sideId: item.selectedSide ? parseInt(item.selectedSide) : undefined,
      notes: item.clarifications || undefined,
    }));

    // Create ISO datetime string for pickup time
    const today = new Date();
    const [hours, minutes] = pickupTime.split(':').map(Number);
    const pickupDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    const pickupTimeISO = pickupDateTime.toISOString();

    return {
      items,
      pickUpTime: pickupTimeISO,
    };
  };

  const handleCheckout = async () => {
    if (!isCheckoutValid()) {
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      const checkoutRequest = transformCartToCheckoutRequest();
      const response = await apiService.createCheckout(checkoutRequest);
      
      if (response.success && response.data?.initPoint) {
        // Redirect to Mercado Pago payment page
        window.location.href = response.data.initPoint;
      } else {
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsProcessingPayment(false);
    }
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
              const isConsumingLastStock = item.stock === item.quantity && item.stock > 0;
              
              return (
                <div key={itemKey}>
                  {isConsumingLastStock && (
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
                    photo={item.photo ? item.photo : ImagePlaceholder}
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
          isDisabled={cart.subtotal === 0 || (!isCheckoutValid()) || isProcessingPayment}
          onCheckout={handleCheckout}
          pickupTime={pickupTime}
          onPickupTimeChange={setPickupTime}
          isTimeValid={isTimeValid}
          isLoading={isProcessingPayment}
        />
      )}
    </div>
  );
}
