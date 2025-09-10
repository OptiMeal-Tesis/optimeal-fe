interface OrdersIconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

export default function OrdersIcon({ width = 24, height = 25, className, color = "black" }: OrdersIconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 25" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M4 2.5V22.5L6 21.5L8 22.5L10 21.5L12 22.5L14 21.5L16 22.5L18 21.5L20 22.5V2.5L18 3.5L16 2.5L14 3.5L12 2.5L10 3.5L8 2.5L6 3.5L4 2.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 8.5H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 12.5H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 16.5H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
