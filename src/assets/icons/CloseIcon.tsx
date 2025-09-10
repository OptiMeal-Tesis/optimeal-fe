interface CloseIconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

export default function CloseIcon({ width = 24, height = 24, className, color = "black" }: CloseIconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M18 6.5L6 18.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 6.5L18 18.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
