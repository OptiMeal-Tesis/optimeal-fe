import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 160, height = 58 }) => {
  return (
    <img 
      src="/src/assets/icons/Logo.svg" 
      alt="OptiMeal Logo" 
      width={width} 
      height={height}
      style={{ display: 'block' }}
    />
  );
};

export default Logo;