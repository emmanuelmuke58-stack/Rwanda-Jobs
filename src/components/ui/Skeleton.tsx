import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export default function Skeleton({ className = '', width, height, circle = false }: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: circle ? '50%' : '1rem',
  };

  return (
    <div 
      className={`animate-pulse bg-gray-200/60 ${className}`} 
      style={style}
    />
  );
}
