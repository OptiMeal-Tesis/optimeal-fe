import { useState } from "react";
import QuantityControl from "./QuantityControl";
import SmallRestrictionChip from "./SmallRestrictionChip";
import PlusIcon from "../assets/icons/PlusIcon";
import LactoseFreeIcon from "../assets/icons/restrictions/LactoseFreeIcon";
import GlutenFreeIcon from "../assets/icons/restrictions/GlutenFreeIcon";
import SugarFreeIcon from "../assets/icons/restrictions/SugarFreeIcon";
import VeganIcon from "../assets/icons/restrictions/VeganIcon";

export type Restriction = "LACTOSE_FREE" | "GLUTEN_FREE" | "SUGAR_FREE" | "VEGAN";

export interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  photo?: string;
  restrictions: Restriction[];
  variant?: "default" | "active" | "summary";
  quantity?: number;
  stock?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onAdd?: () => void;
  onCardClick?: () => void;
}

function renderRestrictionIcon(key: Restriction) {
  const color = "var(--color-primary-500)";
  switch (key) {
    case "LACTOSE_FREE":
      return <LactoseFreeIcon color={color} />;
    case "GLUTEN_FREE":
      return <GlutenFreeIcon color={color} />;
    case "SUGAR_FREE":
      return <SugarFreeIcon color={color} />;
    case "VEGAN":
      return <VeganIcon color={color} />;
    default:
      return null;
  }
}

export default function ProductCard({
  name,
  description,
  price,
  photo,
  restrictions,
  variant = "default",
  quantity = 0,
  stock = 0,
  onIncrease,
  onDecrease,
  onAdd,
  onCardClick,
}: ProductCardProps) {
  const [loaded, setLoaded] = useState(false);
  const peso = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  const isOutOfStock = stock === 0;

  return (
    <div 
      className="w-full flex gap-1.5 rounded-xl" 
      onClick={onCardClick}
    >
      <div className="relative w-[133px] h-[140px] flex-shrink-0 overflow-hidden bg-gray-100 rounded-lg">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <img
          src={photo}
          alt={name}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-body1-bold text-black leading-relaxed truncate py-0.5" title={name}>
              {name}
          </h3>
          <p className="text-body2 text-gray-600 leading-relaxed py-0.5" title={description} style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {description}
          </p>

          <div className="flex items-center gap-2 mt-2">
            {restrictions.map((r, idx) => (
              <SmallRestrictionChip key={idx}>{renderRestrictionIcon(r)}</SmallRestrictionChip>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-body1 font-bold text-black">{peso.format(price)}</span>

          {variant === "default" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!isOutOfStock && onAdd) onAdd();
              }}
              disabled={isOutOfStock}
              className={`flex items-center justify-center ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Agregar"
            >
              <PlusIcon width={32} height={32} color={isOutOfStock ? "#9CA3AF" : "var(--color-primary-500)"} />
            </button>
          )}

          {variant === "active" && (
            <div onClick={(e) => e.stopPropagation()}>
              <QuantityControl 
                quantity={quantity} 
                onDecrease={onDecrease!} 
                onIncrease={onIncrease!} 
                disabled={isOutOfStock}
              />
            </div>
          )}

          {variant === "summary" && (
            <button 
              type="button" 
              onClick={(e) => e.stopPropagation()}
              aria-label="Editar" 
              className="w-10 h-10 rounded-full flex items-center justify-center" 
              style={{ border: '2px solid var(--color-primary-500)' }}
            >
              <span className="text-h2" style={{ color: 'var(--color-primary-500)' }}>✎</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
