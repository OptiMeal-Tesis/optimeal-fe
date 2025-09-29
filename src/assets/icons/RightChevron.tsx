import React from 'react';

interface RightChevronProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function RightChevronIcon({ 
  className = "", 
  width = 24, 
  height = 24 
}: RightChevronProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
