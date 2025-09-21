interface ClockIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function ClockIcon({ 
  width = 24, 
  height = 24, 
  color = "currentColor",
  className = ""
}: ClockIconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M11.9902 2C17.5201 2.00013 22 6.48008 22 12C22 17.5199 17.5201 21.9999 11.9902 22C6.47023 22 2 17.52 2 12C2 6.48 6.47023 2 11.9902 2ZM12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM12.5 7V12.25L17 14.9199L16.25 16.1504L11 13V7H12.5Z" 
        fill={color}
      />
    </svg>
  );
}
