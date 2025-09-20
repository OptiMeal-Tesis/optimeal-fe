import React from 'react';
import QuantityControl from './QuantityControl';
import EditIcon from '../assets/icons/EditIcon';
import { Side } from '../services/api';

interface SummaryCardProps {
  productId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  photo?: string;
  sides: Side[];
  selectedSide?: string | null;
  onQuantityChange: (productId: string, newQuantity: number) => void;
  onEdit?: (productId: string) => void;
  showEditButton?: boolean;
  className?: string;
}

export default function SummaryCard({
  productId,
  name,
  description,
  price,
  quantity,
  photo,
  sides,
  selectedSide,
  onQuantityChange,
  onEdit,
  showEditButton = true,
  className = ""
}: SummaryCardProps) {
  const peso = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(productId, quantity - 1);
    } else {
      onQuantityChange(productId, 0); // Remove item
    }
  };

  const handleIncrease = () => {
    onQuantityChange(productId, quantity + 1);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(productId);
    }
  };

  const getSideText = () => {
    if (sides.length === 0) {
      return null; 
    }
    
    if (!selectedSide) {
      return "Guarnición: -";
    }
    
    const side = sides.find(s => s.id === selectedSide);
    return side ? `Guarnición: ${side.name}` : "Guarnición: -";
  };

  const isSideSelected = sides.length > 0 && selectedSide;
  const showSideText = sides.length > 0; 

  return (
    <div className={`flex gap-2.5 bg-white ${className}`}>
      {photo && (
        <img
          src={photo}
          alt={name}
          className="w-[100px] h-[100px] object-cover rounded-lg"
        />
      )}
      
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-body1 text-black">{name}</h3>
          {showSideText && (
            <p className={`text-body2 ${isSideSelected ? 'text-gray-600' : 'text-color-error'}`}>
              {getSideText()}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-body1-bold text-black">
            {peso.format(price * quantity)}
          </span>
          
          <div className="flex items-center gap-3">
            <QuantityControl
              quantity={quantity}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
            />
            
            {showEditButton && (
              <button 
                type="button"
                className="w-6 h-6 flex items-center justify-center"
                onClick={handleEdit}
              >
                <EditIcon stroke="var(--color-primary-500)" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
