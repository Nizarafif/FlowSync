import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  return (
    <svg 
      className={`${sizeMap[size]} ${className}`} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer gradient orbit line */}
      <path 
        d="M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C19.3137 4 22.2964 5.34315 24.4853 7.51472" 
        stroke="url(#logo-grad-outer)" 
        strokeWidth="3.5" 
        strokeLinecap="round"
      />
      
      {/* Inner sync wave path */}
      <path 
        d="M20 16C20 18.2091 18.2091 20 16 20C13.7909 20 12 18.2091 12 16C12 13.7909 13.7909 12 16 12C18.2091 12 20 13.7909 20 16Z" 
        stroke="url(#logo-grad-inner)" 
        strokeWidth="3" 
        strokeLinecap="round"
      />

      {/* Sync core dot */}
      <circle 
        cx="16" 
        cy="16" 
        r="3.5" 
        fill="#14B8A6" 
        className="animate-pulse"
      />

      <defs>
        <linearGradient id="logo-grad-outer" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="0.5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="logo-grad-inner" x1="12" y1="12" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14B8A6" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
