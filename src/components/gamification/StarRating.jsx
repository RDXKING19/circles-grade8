import React from 'react';

export function StarRating({ stars = 0, max = 3, size = 'md' }) {
  const sizeClass = {
    sm: 'text-sm gap-0.5',
    md: 'text-lg gap-1',
    lg: 'text-2xl gap-1.5'
  }[size] || 'text-lg gap-1';

  return (
    <div className={`inline-flex items-center ${sizeClass}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={i < stars ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]' : 'text-white/20'}
        >
          ★
        </span>
      ))}
    </div>
  );
}
