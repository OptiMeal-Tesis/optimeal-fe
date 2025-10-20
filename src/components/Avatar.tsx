import React from "react";

interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const getInitials = (name?: string) => {
  if (!name) return "";
  
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  
  if (!parts[0] || parts[0].length === 0) return "";
  
  let initials = parts[0][0].toUpperCase(); // Primera inicial del nombre
  
  if (parts.length >= 2 && parts[1] && parts[1].length > 0) {
    initials += parts[1][0].toUpperCase(); // Primera inicial del apellido
  }
  
  if (parts.length >= 3 && parts[2] && parts[2].length > 0) {
    initials += parts[2][0].toUpperCase(); // Segunda inicial del apellido
  }
  
  return initials;
};

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-xl"
};

export default function Avatar({ name, size = "lg", className = "" }: AvatarProps) {
  const initials = getInitials(name);
  
  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-primary-500 text-white font-medium ${sizeClasses[size]} ${className}`}
    >
      <span className="leading-none">{initials}</span>
    </div>
  );
}
