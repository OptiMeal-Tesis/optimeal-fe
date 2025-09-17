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
      className={`fixed left-4 right-4 bottom-4 z-50 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-2.5 flex items-center justify-between ${className ?? ""}`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 10px)" }} // safe area for iOS
      role="region"
      aria-label="Resumen de compra"
    >
      <div className="flex items-center gap-4">
        <CartIcon width={24} height={25} color="black" />
        <div className="flex flex-col">
          <span className="text-body2 text-black font-bold">Subtotal</span>
          <span className="text-body1 text-black">{peso.format(subtotal)}</span>
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
