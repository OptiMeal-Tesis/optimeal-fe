import CartIcon from "../assets/icons/CartIcon";

interface SubtotalButtonProps {
  subtotal: number;              // in ARS
  disabled: boolean;
  onContinue: () => void;
  className?: string;
}

export default function SubtotalButton({ subtotal, disabled, onContinue, className }: SubtotalButtonProps) {
  const peso = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  return (
    <button
      type="button"
      onClick={onContinue}
      disabled={disabled}
      className={`fixed left-4 right-4 bottom-4 z-50 ${disabled ? "bg-gray-200" : "bg-primary"} rounded-xl shadow-lg px-6 py-4 flex items-center justify-between ${className ?? ""} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      aria-label="Resumen de compra - Continuar"
      aria-disabled={disabled}
    >
      <div className="flex items-center gap-4">
        <CartIcon width={24} height={25} color={disabled ? "black" : "white"} />
        <div className="flex flex-col gap-1">
          <span className={`text-body1 ${disabled ? "text-black" : "text-white"}`}>Subtotal</span>
          <span className={`text-body1 ${disabled ? "text-black" : "text-white"}`}>{peso.format(subtotal)}</span>
        </div>
      </div>

      <span className={`text-sub1-bold ${disabled ? "text-gray-400" : "text-white"}`}>
        Continuar
      </span>
    </button>
  );
}
