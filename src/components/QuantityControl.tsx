interface QuantityControlProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
}

export default function QuantityControl({ quantity, onDecrease, onIncrease, disabled = false }: QuantityControlProps) {
  return (
    <div
      className={`flex items-center gap-4.5 px-4 py-2 max-h-8 rounded-2xl ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{
        border: `2px solid ${disabled ? '#9CA3AF' : 'var(--color-primary-500)'}`
      }}
    >
      <button 
        type="button" 
        className={`text-body2-bold ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-primary-500'}`} 
        onClick={disabled ? undefined : onDecrease}
        disabled={disabled}
      >
        -
      </button>
      <span className={`text-body2-bold select-none ${disabled ? 'text-gray-400' : 'text-primary-500'}`}>
        {quantity}
      </span>
      <button 
        type="button" 
        className={`text-body2-bold ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-primary-500'}`} 
        onClick={disabled ? undefined : onIncrease}
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
}
