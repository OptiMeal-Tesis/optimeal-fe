interface QuantityControlProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export default function QuantityControl({ quantity, onDecrease, onIncrease }: QuantityControlProps) {
  return (
    <div
      className="flex items-center gap-4.5 px-4 py-2 rounded-2xl"
      style={{
        border: '2px solid var(--color-primary-500)'
      }}
    >
      <button type="button" className="text-label-bold" onClick={onDecrease}>-</button>
      <span className="text-label-bold text-black select-none">{quantity}</span>
      <button type="button" className="text-label-bold" onClick={onIncrease}>+</button>
    </div>
  );
}
