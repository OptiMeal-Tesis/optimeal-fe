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
    <div
      className={`fixed left-4 right-4 bottom-4 z-50 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-4 flex items-center justify-between ${className ?? ""}`}
      role="region"
      aria-label="Resumen de compra"
    >
      <div className="flex items-center gap-4">
        <CartIcon width={24} height={25} color="black" />
        <div className="flex flex-col gap-1">
          <span className="text-body1 text-black">Subtotal</span>
          <span className="text-body1 text-gray-600">{peso.format(subtotal)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={disabled}
        className={`text-sub1-bold ${disabled ? "text-gray-500 cursor-not-allowed" : "text-[var(--color-primary-500)]"}`}
        aria-disabled={disabled}
      >
        Continuar
      </button>
    </div>
  );
}
