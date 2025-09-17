interface CartIconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

export default function CartIcon({ 
  width = 24, 
  height = 25, 
  className = "", 
  color = "black" 
}: CartIconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 25" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M8 22.5C8.55228 22.5 9 22.0523 9 21.5C9 20.9477 8.55228 20.5 8 20.5C7.44772 20.5 7 20.9477 7 21.5C7 22.0523 7.44772 22.5 8 22.5Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M19 22.5C19.5523 22.5 20 22.0523 20 21.5C20 20.9477 19.5523 20.5 19 20.5C18.4477 20.5 18 20.9477 18 21.5C18 22.0523 18.4477 22.5 19 22.5Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M2.05 2.54999H4.05L6.71 14.97C6.80758 15.4248 7.06067 15.8315 7.42571 16.1198C7.79076 16.4082 8.24491 16.5603 8.71 16.55H18.49C18.9452 16.5493 19.3865 16.3933 19.741 16.1078C20.0956 15.8224 20.3421 15.4245 20.44 14.98L22.09 7.54999H5.12" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
