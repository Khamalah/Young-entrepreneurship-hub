import React from 'react';
import logoImage from '../../assets/logo.png';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <img
        src={logoImage}
        alt="Young Entrepreneurship Hub Logo"
        className="h-12 w-auto object-contain shrink-0 rounded-xl shadow-sm"
      />

      {showText && (
        <div className="flex flex-col items-center leading-none gap-0.5">
          <span className="font-bold text-primary whitespace-nowrap text-sm">Young Entrepreneurship</span>
          <span className="font-bold text-foreground text-sm">Hub</span>
        </div>
      )}
    </div>
  );
}