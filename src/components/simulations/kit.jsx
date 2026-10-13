import React from 'react';

export function StepSlider({
  value,
  min = 0,
  max = 360,
  step = 5,
  onChange,
  label = 'Value',
  unit = '',
  disabled = false
}) {
  const handleDec = () => {
    if (disabled) return;
    const next = Math.max(min, value - step);
    onChange(next);
  };

  const handleInc = () => {
    if (disabled) return;
    const next = Math.min(max, value + step);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-sm sm:text-base font-black text-slate-100">
        <span>{label}</span>
        <span className="text-amber-300 font-display font-900 text-base sm:text-lg">
          {value}{unit}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleDec}
          disabled={disabled || value <= min}
          className="w-9 h-9 rounded-full bg-[#201042] border border-white/20 text-white font-black text-lg flex items-center justify-center hover:bg-[#341b68] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition shrink-0"
        >
          −
        </button>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 accent-amber-400 h-2.5 bg-purple-950/80 rounded-lg cursor-pointer disabled:cursor-not-allowed"
        />

        <button
          type="button"
          onClick={handleInc}
          disabled={disabled || value >= max}
          className="w-9 h-9 rounded-full bg-[#201042] border border-white/20 text-white font-black text-lg flex items-center justify-center hover:bg-[#341b68] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition shrink-0"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function Panel({ title, children, className = '' }) {
  return (
    <div className={`bg-[#180a3c]/90 border border-purple-400/35 rounded-2xl p-3 sm:p-4 shadow-xl ${className}`}>
      {title && (
        <h4 className="font-display font-900 text-sm sm:text-base text-amber-300 uppercase tracking-wider mb-2">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}

export function Msg({ type = 'info', children }) {
  const tones = {
    info: 'border-cyan-400/40 bg-cyan-950/70 text-cyan-200',
    success: 'border-emerald-400/50 bg-emerald-950/80 text-emerald-100',
    warning: 'border-amber-400/50 bg-amber-950/80 text-amber-100',
    error: 'border-rose-400/50 bg-rose-950/80 text-rose-100'
  };

  return (
    <div className={`border rounded-xl px-4 py-2 text-xs sm:text-sm md:text-base font-bold leading-snug ${tones[type] || tones.info}`}>
      {children}
    </div>
  );
}

export function GoldBtn({ onClick, disabled, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-gold text-sm sm:text-base py-2.5 px-6 font-display font-900 shadow-md disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostBtn({ onClick, disabled, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-ghost text-sm sm:text-base py-2 px-5 font-bold disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
