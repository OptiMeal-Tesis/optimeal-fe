import { OrderItemResponse } from '../services/api';

interface OrderItemCardProps {
  orderItem: OrderItemResponse;
  className?: string;
}

export default function OrderItemCard({ orderItem, className = "" }: OrderItemCardProps) {
  const peso = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  const getSideText = () => {
    if (orderItem.side) {
      return `Guarnición: ${orderItem.side.name}`;
    }
    return null;
  };

  const getNotesText = () => {
    if (orderItem.notes) {
      return `Aclaraciones: ${orderItem.notes}`;
    }
    return null;
  };

  const sideText = getSideText();
  const notesText = getNotesText();

  return (
    <div className={`flex gap-2.5 bg-white ${className}`}>
      {orderItem.product.photo && (
        <img
          src={orderItem.product.photo}
          alt={orderItem.product.name}
          className="w-[100px] h-[100px] object-cover rounded-lg"
        />
      )}
      
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-body1 text-black">
              {orderItem.product.name}
            </p>    
            <span className="text-body1-bold text-black">
              x{orderItem.quantity}
            </span>
          </div>
          
          {sideText && (
            <p className="text-body2 text-gray-600">
              {sideText}
            </p>
          )}
          
          {notesText && (
            <p className="text-body2 text-gray-600">
              {notesText}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-body1-bold text-black">
            {peso.format(orderItem.product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
