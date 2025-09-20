import React from 'react';

interface EditIconProps {
  className?: string;
  stroke?: string;
}

export default function EditIcon({ className = "", stroke = "currentColor" }: EditIconProps) {
  return (
    <svg 
      width="24" 
      height="25" 
      viewBox="0 0 24 25" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M21.174 7.31201C21.7027 6.78344 21.9998 6.06648 21.9999 5.31887C22 4.57125 21.7031 3.85422 21.1745 3.32551C20.6459 2.79681 19.929 2.49973 19.1813 2.49963C18.4337 2.49954 17.7167 2.79644 17.188 3.32501L3.842 16.674C3.60981 16.9055 3.43811 17.1905 3.342 17.504L2.021 21.856C1.99515 21.9425 1.9932 22.0344 2.01535 22.1219C2.03749 22.2094 2.08292 22.2892 2.14679 22.353C2.21067 22.4168 2.29062 22.4621 2.37815 22.4841C2.46569 22.5061 2.55755 22.504 2.644 22.478L6.997 21.158C7.31017 21.0628 7.59517 20.8921 7.827 20.661L21.174 7.31201Z" 
        stroke={stroke} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M15 5.5L19 9.5" 
        stroke={stroke} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
