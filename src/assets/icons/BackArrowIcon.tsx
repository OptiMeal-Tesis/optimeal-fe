interface BackArrowIconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

export default function BackArrowIcon({ width = 24, height = 25, className, color = "black" }: BackArrowIconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 25" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M15 18.5L9 12.5L15 6.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
