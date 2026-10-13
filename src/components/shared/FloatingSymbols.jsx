import React, { useMemo } from 'react';

const CIRCLE_GLYPHS = ['π', '2πr', 'πr²', '90°', 'C = πd', 'r = 7', '22/7', '◔', '360°', 'A = πr²', '180°', '3.14'];

export function FloatingSymbols() {
  const symbols = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      char: CIRCLE_GLYPHS[i % CIRCLE_GLYPHS.length],
      left: `${(i * 6.25 + 3) % 96}%`,
      top: `${(i * 13 + 5) % 92}%`,
      size: `${14 + (i % 4) * 5}px`,
      delay: `${(i * 0.7) % 6}s`,
      duration: `${14 + (i % 5) * 3}s`,
      opacity: 0.12 + (i % 3) * 0.08
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {symbols.map(s => (
        <span
          key={s.id}
          style={{
            left: s.left,
            top: s.top,
            fontSize: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
            opacity: s.opacity
          }}
          className="absolute text-purple-200/50 font-display font-extrabold animate-pulse transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000"
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}
