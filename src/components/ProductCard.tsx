import QuantityControl from "./QuantityControl";
import RestrictionChip from "./RestrictionChip";
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
  onIncrease?: () => void;
  onDecrease?: () => void;
  onAdd?: () => void;
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
  onIncrease,
  onDecrease,
  onAdd,
}: ProductCardProps) {
  const peso = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  return (
    <div className="w-full flex gap-1.5 bg-white rounded-xl">
      <img
        src={photo}
        alt={name}
        className="w-[133px] h-[140px] object-cover rounded-lg"
      />

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-body1-bold text-black leading-tight">{name}</h3>
          <p className="text-body2 text-gray-600">{description}</p>

          <div className="flex items-center gap-2 mt-2">
            {restrictions.map((r, idx) => (
              <RestrictionChip key={idx}>{renderRestrictionIcon(r)}</RestrictionChip>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-body1 font-bold text-black">{peso.format(price)}</span>

          {variant === "default" && (
            <button
              type="button"
              onClick={onAdd}
              className="flex items-center justify-center"
              aria-label="Agregar"
            >
              <PlusIcon width={32} height={32} color="var(--color-primary-500)" />
            </button>
          )}

          {variant === "active" && (
            <QuantityControl quantity={quantity} onDecrease={onDecrease!} onIncrease={onIncrease!} />
          )}

          {variant === "summary" && (
            <button type="button" aria-label="Editar" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: '2px solid var(--color-primary-500)' }}>
              <span className="text-h2" style={{ color: 'var(--color-primary-500)' }}>✎</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
