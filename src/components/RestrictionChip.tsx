import LactoseFreeIcon from '../assets/icons/restrictions/LactoseFreeIcon';
import GlutenFreeIcon from '../assets/icons/restrictions/GlutenFreeIcon';
import SugarFreeIcon from '../assets/icons/restrictions/SugarFreeIcon';
import VeganIcon from '../assets/icons/restrictions/VeganIcon';
import { Restriction } from '../services/api';

interface RestrictionChipProps {
  restriction: Restriction;
  className?: string;
}

function renderRestrictionIcon(restriction: Restriction) {
  const color = "var(--color-primary-500)";
  switch (restriction) {
    case "LACTOSE_FREE":
      return <LactoseFreeIcon color={color} width={24} height={24}/>;
    case "GLUTEN_FREE":
      return <GlutenFreeIcon color={color} width={24} height={24}/>;
    case "SUGAR_FREE":
      return <SugarFreeIcon color={color} width={24} height={24}/>;
    case "VEGAN":
      return <VeganIcon color={color} width={24} height={24}/>;
    default:
      return null;
  }
}

function getRestrictionLabel(restriction: Restriction): string {
  switch (restriction) {
    case "LACTOSE_FREE":
      return "Sin lactosa";
    case "GLUTEN_FREE":
      return "Sin gluten";
    case "SUGAR_FREE":
      return "Sin azúcar";
    case "VEGAN":
      return "Vegano";
    default:
      return restriction;
  }
}

export default function RestrictionChip({ 
  restriction, 
  className = "" 
}: RestrictionChipProps) {
  return (
    <div
      className={`flex flex-row items-center w-32 justify-center gap-2 px-3 py-2 rounded-full ${className}`}
      style={{
        backgroundColor: 'rgba(13, 71, 161, 0.1)',
        color: 'var(--color-primary-500)'
      }}
    >
      {renderRestrictionIcon(restriction) && (
        <div
          aria-hidden="true"
        >
          {renderRestrictionIcon(restriction)}
        </div>
      )}
      <span className="text-body2 whitespace-nowrap" style={{ color: 'var(--color-primary-500)' }}>
        {getRestrictionLabel(restriction)}
      </span>
    </div>
  );
}
