interface LogoutIconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

export default function LogoutIcon({ width = 24, height = 25, className, color = "black" }: LogoutIconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 25" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M16 17.5L21 12.5L16 7.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12.5H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21.5H5C4.46957 21.5 3.96086 21.2893 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V5.5C3 4.96957 3.21071 4.46086 3.58579 4.08579C3.96086 3.71071 4.46957 3.5 5 3.5H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
