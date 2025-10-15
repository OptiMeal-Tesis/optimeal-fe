import { useState, useEffect } from "react";
import { useCart } from "../cart";
import { generateCartItemKey } from "../cart/cart";
import PageHeader from "../components/PageHeader";
import SummaryItemCard from "../components/SummaryCard";
import CheckoutSummary from "../components/CheckoutSummary";
import formatDate from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { apiService, CheckoutRequest, ShiftsResponse } from "../services/api";
import { getSelectedShiftStorage, setSelectedShiftStorage } from "../cart/cart";
import ImagePlaceholder from "../assets/images/image-placeholder.jpg";
import toast from "react-hot-toast";

export default function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const cartItems = Object.values(cart.items);
  const [selectedShift, setSelectedShift] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [shifts, setShifts] = useState<string[]>([]);
  const [shiftsLoading, setShiftsLoading] = useState(true);
  const [shiftsError, setShiftsError] = useState<string | null>(null);

  // selected shift storage helpers moved to utils/selectedShiftStorage

  const updateSelectedShift = (shift: string): void => {
    setSelectedShift(shift);
    setSelectedShiftStorage(shift);
  };

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

  const validateSelectedShift = (shift: string): boolean => {
    return shift !== "" && shift.trim() !== "";
  };

  const parseShiftToPickupTime = (shift: string): string => {
    const startTime = shift.split('-')[0];
    const today = new Date();
    const [hours, minutes] = startTime.split(':').map(Number);
    const pickupDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    return pickupDate.toISOString();
  };

  const findClosestShift = (availableShifts: string[]): string => {
    if (availableShifts.length === 0) return "";
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes for easier comparison
    
    let closestShift = "";
    let minTimeDifference = Infinity;
    
    const validShifts = availableShifts
      .filter(shift => shift.toLowerCase() !== 'all')
      .sort((a, b) => {
        const timeA = a.split('-')[0];
        const timeB = b.split('-')[0];
        return timeA.localeCompare(timeB);
      });
    
    if (validShifts.length === 0) return "";
    
    // Find closest shift
    for (const shift of validShifts) {
      const startTime = shift.split('-')[0];
      const [hours, minutes] = startTime.split(':').map(Number);
      const shiftTime = hours * 60 + minutes;
      const timeDifference = Math.abs(shiftTime - currentTime);
      
      if (timeDifference < minTimeDifference) {
        minTimeDifference = timeDifference;
        closestShift = shift;
      }
    }
    
    const lastShift = validShifts[validShifts.length - 1];
    const lastShiftTime = lastShift.split('-')[0];
    const [lastHours, lastMinutes] = lastShiftTime.split(':').map(Number);
    const lastShiftTimeMinutes = lastHours * 60 + lastMinutes;
    
    if (currentTime > lastShiftTimeMinutes) {
      return lastShift;
    }
    
    return closestShift;
  };

  // Fetch shifts on component mount
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setShiftsLoading(true);
        setShiftsError(null);
        const response: ShiftsResponse = await apiService.getShifts();
        
        if (response.success) {
          setShifts(response.data);
        } else {
          setShiftsError(response.message || 'Error al cargar los horarios');
        }
      } catch (err) {
        setShiftsError('Error al cargar los horarios disponibles');
        console.error('Error fetching shifts:', err);
      } finally {
        setShiftsLoading(false);
      }
    };

    fetchShifts();
  }, []);

  useEffect(() => {
    if (shifts.length > 0 && !selectedShift) {
      const savedShift = getSelectedShiftStorage();
      
      if (savedShift && shifts.includes(savedShift)) {
        setSelectedShift(savedShift);
      } else {
        const closestShift = findClosestShift(shifts);
        if (closestShift) {
          setSelectedShift(closestShift);
          setSelectedShiftStorage(closestShift);
        }
      }
    }
  }, [shifts]);

  const isShiftValid = validateSelectedShift(selectedShift);
  const isCheckoutValid = (): boolean => {
    return validateRequiredSides() && isShiftValid;
  };

  const transformCartToCheckoutRequest = (): CheckoutRequest => {
    const items = cartItems.map(item => ({
      productId: parseInt(item.productId),
      quantity: item.quantity,
      sideId: item.selectedSide ? parseInt(item.selectedSide) : undefined,
      notes: item.clarifications || undefined,
    }));

    const pickupTimeISO = parseShiftToPickupTime(selectedShift);

    return {
      items,
      pickUpTime: pickupTimeISO,
      shift: selectedShift,
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
        window.location.href = response.data.initPoint;
      } else {
        toast.error('Error al procesar el pago. Por favor intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      
      if (error instanceof Error) {
        const errorMessage = error.message || 'Error desconocido';
        
        if ((error as any).status === 400) {
          toast.error('Error de validación. Por favor verifica los datos e intenta nuevamente.');
        } else if ((error as any).status === 401) {
          toast.error('Sesión expirada. Inicia sesión nuevamente.');
        } else {
          toast.error('Error al procesar el pago');
        }
      } else {
        toast.error('Error inesperado al procesar el pago');
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <PageHeader title="Tu Pedido" subtitle={formatDate(new Date())} />
      
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
          selectedShift={selectedShift}
          onShiftChange={updateSelectedShift}
          isShiftValid={isShiftValid}
          isLoading={isProcessingPayment}
          shifts={shifts}
          shiftsLoading={shiftsLoading}
          shiftsError={shiftsError}
        />
      )}
    </div>
  );
}
