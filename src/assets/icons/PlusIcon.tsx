interface PlusIconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

export default function PlusIcon({ width = 32, height = 32, className, color = "var(--color-primary-500)" }: PlusIconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle 
        cx="16" 
        cy="16" 
        r="14" 
        stroke={color} 
        strokeWidth="2"
      />
      <path 
        d="M16 8V24M8 16H24" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
